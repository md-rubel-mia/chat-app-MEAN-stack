import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';

import { ChatService } from 'app/chat/chat.service';
import { LoginService } from 'app/login/services/login.service';

@Component({
    selector     : 'chat-chats-sidenav',
    templateUrl  : './chats.component.html',
    styleUrls    : ['./chats.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChatChatsSidenavComponent implements OnInit, OnDestroy
{
    chats: any[];
    chatSearch: any;
    contacts: any[];
    searchText: string;
    user: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private chatService: ChatService,
        private fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public mediaObserver: MediaObserver,
        private loginService : LoginService
    ) {
        this.chatSearch = {
            name: ''
        };
        this.searchText = '';
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.chats = this.chatService.chats;
        this.chatService.onChatsUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                this.chats = updatedChats;
            });

        this.loginService.currentUserData.subscribe(user => {
            this.user = user;
        })
        this.getContacts();
    }

    getContacts() {
        this.chatService.getAllContacts()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe( res => {
            this.contacts = res['users'];
            console.log("contacts ", this.contacts);
            
        })
    }

    getChat(fromId): void {
        this.chatService.getChat(fromId, this.user['userid']);

        if ( !this.mediaObserver.isActive('gt-md') ) {
            this.fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }

    setUserStatus(status){
        this.chatService.setUserStatus(status);
    }

    changeLeftSidenavView(view){
        this.chatService.onLeftSidenavViewChanged.next(view);
    }

    logout(){
        console.log('logout triggered');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
