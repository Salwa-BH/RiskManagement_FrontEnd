import { Injectable }       from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
 
@Injectable()
export class AuthGuardService implements CanActivate {
  
  constructor(private router: Router) {
  }
 
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // if user is connected, can view pages
    if( localStorage.getItem("userConnectedId")){
      console.log("redirect true");
      return true
    }
    // if usr is not connected go to auth page
    else{
      console.log("redirect true");
      this.router.navigate(["/auth"]);
      return false;
    }

  }
} 
 