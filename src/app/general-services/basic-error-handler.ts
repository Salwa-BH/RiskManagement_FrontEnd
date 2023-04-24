import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    toastrs: ToastrService;
  
    constructor() {}

    // Handling HTTP Errors using Toaster
    public handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        errorMessage = "An error occurred: " + err;
        //this.toastrs.error(errorMessage);
      
    }
}