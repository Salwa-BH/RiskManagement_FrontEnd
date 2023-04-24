import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.usertoken.pipe(
      take(1),
      exhaustMap((usertoken) => {
        if (!usertoken) return next.handle(req);
        const modifiedReq = req.clone({
          params: new HttpParams().set("Authorization", "Token " + usertoken.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
