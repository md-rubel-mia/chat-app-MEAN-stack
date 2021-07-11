import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginService } from '../login/services/login.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService,
              private router: Router
    ) {}
  canActivate(): Observable<boolean> {
    return this.loginService.currentUserData.pipe(
        tap(user => {
          console.log("User data ==>",user);
        }),
        map(user => {
            if(user){
              // this.router.navigateByUrl("chat");
              return true;
            }
            else {
              this.router.navigateByUrl("login");
              return false;
            }
        })
      )
  }
  
}
