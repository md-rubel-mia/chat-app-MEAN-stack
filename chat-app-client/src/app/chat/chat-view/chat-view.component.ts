import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ChatService } from 'app/chat/chat.service';
import { LoginService } from 'app/login/services/login.service';

@Component({
    selector     : 'chat-view',
    templateUrl  : './chat-view.component.html',
    styleUrls    : ['./chat-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewInit
{
    user: any;
    chat: any;
    dialog: any;
    contact: any = {};
    replyInput: any;
    selectedChat = [];
    noHistory = false;
    selectedChatIds: any;
    currentUserInfo: any = {};

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    @ViewChildren('replyInput')
    replyInputField;

    replyForm;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private chatService: ChatService,
        private fb: FormBuilder,
        private loginService: LoginService
    )
    {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void
    {
        this.user = this.chatService.user;
         this.getChatData();  
         this.initForm();
         this.loginService.currentUserData.subscribe(user => {
             this.currentUserInfo = user;
         })

         this.chatService.getNewMessage().subscribe(res => {
             if( res && this.selectedChatIds && res.toUser==this.selectedChatIds.toUser && res.fromUser==this.selectedChatIds.fromUser) {
                this.selectedChat.push(res);
             }
         })
    }

    initForm() {
        this.replyForm = this.fb.group( {
            message: ['', Validators.required]
          }
        )
    }

    getChatData() {
        this.chatService.currentSelectedContactInfo.subscribe(res => {
            this.selectedChatIds = res;
           this.getSelectedUserData(res['fromUser']);
        })
        this.chatService.onChatSelected
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(chatData => {
            console.log("Chat data " , chatData);
            
            if (chatData && chatData.length > 0) {
                this.selectedChat = chatData;
                this.readyToReply();
                this.noHistory = false;
            }
            else {
                this.noHistory = true;
                this.selectedChat = [];
            }
        });
    }

    getSelectedUserData(id) {
        if(id) {
            this.chatService.getUser(id).subscribe(res => {
                this.contact = res;
            })    
        }
    }

    ngAfterViewInit(): void
    {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    ngOnDestroy(): void
    {

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean
    {
        return (
            message.who === this.contact.id &&
            ((this.dialog[i + 1] && this.dialog[i + 1].who !== this.contact.id) || !this.dialog[i + 1])
        );
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean
    {
        return (i === 0 || this.dialog[i - 1] && this.dialog[i - 1].who !== message.who);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean
    {
        return (i === this.dialog.length - 1 || this.dialog[i + 1] && this.dialog[i + 1].who !== message.who);
    }

    /**
     * Select contact
     */
    selectContact(): void
    {
        this.chatService.selectContact(this.contact);
    }

    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
            this.focusReplyInput();
            this.scrollToBottom();
        });
    }

    /**
     * Focus to the reply input
     */
    focusReplyInput(): void
    {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void
    {
        speed = speed || 400;
        if ( this.directiveScroll )
        {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply() {
        const formValue = this.replyForm.value;
        const payload = {
            fromUser: this.selectedChatIds.toUser,
            toUser: this.selectedChatIds.fromUser,
            message: formValue.message
        }

        this.chatService.sendMessage(payload).subscribe(response => {
            console.log(response);
            this.selectedChat.push(payload);
            this.noHistory = false;
            this.replyForm.reset();
        });
    }
}
