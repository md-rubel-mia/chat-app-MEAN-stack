import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { map } from 'rxjs/operators'
import {io} from 'socket.io-client';
 
@Injectable()
export class ChatService implements Resolve<any>
{
    contacts: any[];
    chats: any[];
    user: any;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    currentSelectedContactInfo: BehaviorSubject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;
    updateFromSocket: BehaviorSubject<any>;
    baseUrl = "http://localhost:5000/";
    scoket = io('http://localhost:5000', { transports: ['websocket'] });

    constructor(
        private http: HttpClient
    )
    {
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
        this.currentSelectedContactInfo = new BehaviorSubject(null);
        this.updateFromSocket = new BehaviorSubject(null);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getContacts(),
                this.getChats(),
            ]).then(
                ([contacts, chats]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getChat(fromUser, toUser) {
        console.log(fromUser, toUser);
        
        this.currentSelectedContactInfo.next({fromUser, toUser});
        this.http.post(`${this.baseUrl}inbox/getConversation`,  {fromUser, toUser})
        .pipe(
            map(res => res['messages'])
        )
        .subscribe(res => {
            
            this.onChatSelected.next(res);
        })

    }

    sendMessage(messagePayload) {
       return this.http.post(`${this.baseUrl}inbox`, messagePayload);
    }

    selectContact(contact): void
    {
        this.onContactSelected.next(contact);
    }

    setUserStatus(status): void
    {
        this.user.status = status;
    }

    updateUserData(userData): void {
        this.http.post('api/chat-user/' + this.user.id, userData)
            .subscribe((response: any) => {
                    this.user = userData;
                }
            );
    }

    updateDialog(chatId, dialog): Promise<any> {
        return new Promise((resolve, reject) => {

            const newData = {
                id    : chatId,
                dialog: dialog
            };

            this.http.post('api/chat-chats/' + chatId, newData)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
        });
    }

    getContacts() {
        return new Promise((resolve, reject) => {
            this.http.get('api/chat-contacts')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getChats() {
        return new Promise((resolve, reject) => {
            this.http.get('api/chat-chats')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getUser(payload) {
        return this.http.post(`${this.baseUrl}user`, {id: payload});
    }

    getAllContacts() {
       return this.http.get(`${this.baseUrl}user`);
    }

    getSelecteduserInfo() {

    }

    getNewMessage() {
        this.scoket.on('new_message',  (message)=> {
            this.updateFromSocket.next(message);
        })
        return this.updateFromSocket.asObservable();
    }
}
