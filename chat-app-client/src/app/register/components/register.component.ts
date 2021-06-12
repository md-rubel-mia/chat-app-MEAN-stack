import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from 'src/@fuse/animations';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;

  private _unsubscribeAll: Subject<any>;

  constructor(
      private _formBuilder: FormBuilder
  ){
      this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void
  {
      this.registerForm = this._formBuilder.group({
          name           : ['', Validators.required],
          email          : ['', [Validators.required, Validators.email]],
          password       : ['', Validators.required],
          passwordConfirm: ['', Validators.required]
      });

  }

  ngOnDestroy(): void
  {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
