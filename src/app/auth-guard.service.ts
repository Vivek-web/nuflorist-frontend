import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree  } from "@angular/router";
import { Observable } from 'rxjs';
import {Router, ActivatedRoute,} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): |boolean |UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>  {
   const currentUser = localStorage.getItem('nu_c_user_id')
         if(currentUser){
           return true;
         }
         return this.router.createUrlTree(['/'])
  }
} 
