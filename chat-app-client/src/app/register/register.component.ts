import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '../../@fuse/services/config.service';
import { fuseAnimations } from '../../@fuse/animations';
import { Router } from '@angular/router';
import { RegisterService } from "./services/register.service"

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router : Router,
        private registerService: RegisterService
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
        this.initRegisterForm();
    }

    initRegisterForm() {
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            mobile          : ['', Validators.required],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    register() {
        const user = this.registerForm.value;
        delete user.passwordConfirm;
        
        this.registerService.registerUser(user)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(res => {
            if(res && res['message']) {
                this.registerForm.reset();
                this.gotoLogin();
            }
        }, (err) => {
            console.log(err);
        })
    }

    gotoLogin() {
        this.router.navigateByUrl("login");
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if ( !control.parent || !control ) {
        return null;
    }
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm ) {
        return null;
    }
    if ( passwordConfirm.value === '' ) {
        return null;
    }
    if ( password.value === passwordConfirm.value ) {
        return null;
    }
    return {passwordsNotMatching: true};
};
