import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {catchError, retry, delay,finalize} from 'rxjs/operators';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

import { Error } from "./shared/errors/error.model"
import { ErrorDialogService}  from "./shared/errors/error-dialog.service"
import { LoadingDialogService } from "./shared/loading/loading-dialog.service"

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpInterceptorService implements HttpInterceptor {

  error: Error;

  constructor(public router: Router,
    private toastr: ToastrService,
    private errorDialogService: ErrorDialogService,
    private loadingDialogService: LoadingDialogService,
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {{

    //setTimeout(() => { this.loadingDialogService.openDialog(); }, 100);


    //this.loadingDialogService.openDialog();

    let startFrom = new Date().getTime();
    return next.handle(req)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError((error: HttpErrorResponse) => {
        let timestamp:number = ((new Date().getTime() - startFrom) / 1000) % 60;
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        error.headers.getAll(error.name);

        let arrayKeys: string[]=[];
        error.headers['normalizedNames'].forEach( k=> {
          arrayKeys.push(k)
        });

        let customizedHeaders: string = "";
        let i=0;
        error.headers['headers'].forEach( a => {
          customizedHeaders = customizedHeaders.concat( arrayKeys[i] + " : " + a.toString() + "; ")
          i++;
        });
       let email = localStorage.getItem("authenticatedUserEmail").slice(1,-1); // slice to remove " from email
       this.error = new Error(error.name, customizedHeaders, error.status, error.statusText, error.message, error.url,email,timestamp.toString());
       this.errorDialogService.createLog(this.error)
        
        //this.errorDialogService.openDialog(error.message ?? JSON.stringify(error), error.status);
        return throwError( errorMessage );
      }),
      // finalize(() => {
      //   this.loadingDialogService.hideDialog();

      // })
    )
  }}
}