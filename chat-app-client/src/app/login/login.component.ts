import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from './services/login.service';
import { takeUntil, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;
    loginForm: FormGroup;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router : Router,
        private loginService: LoginService,
        private cookieService: CookieService
    )
    {
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void
    {
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    login() {
        this.loginService.loginUser(this.loginForm.value)
        .pipe(
          takeUntil(this._unsubscribeAll),
          tap(res => console.log(res.body)),
          map(res => res.body)
         )
        .subscribe(user => {
            if(user) {
               this.cookieService.set('chat', JSON.stringify(user)); 
               this.loginService.setCuurentUser(user); 
               this.router.navigateByUrl("chat");
            }
        }, err => {
            console.log(err.error.message);
        })
    }

    gotoRegister() {
        this.router.navigateByUrl("register");
    }
}
