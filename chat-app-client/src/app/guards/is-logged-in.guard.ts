import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor( private loginService: LoginService, 
               private router : Router
    ) {}

  canActivate(): Observable<boolean>  {
      return this.loginService.currentUserData.pipe(
        map(res => {
          if(res) {
            this.router.navigateByUrl("chat");
            return false;
          }
          else {
            return true;
          }
        })
      )
  }
  
}
