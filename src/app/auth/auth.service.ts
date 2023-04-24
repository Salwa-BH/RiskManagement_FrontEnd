import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse , HttpBackend} from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { UserToken } from "./user.model";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
// Role Profile And Group of user
import { UserAssign } from "../models/permissions/UserAssign"
import { User } from "../models/permissions/User.model"



export interface AuthResponseData {
  token: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  usertoken = new BehaviorSubject<UserToken>(null);
  userConnectedAssign: UserAssign;
  private http: HttpClient;

  authenticated: boolean=false;


  constructor(private router: Router ,httpBackend: HttpBackend, private toastr : ToastrService, ) {
    this.http = new HttpClient(httpBackend);
  }
  //constructor(private http: HttpClient,) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.authenticated = true;
          this.handleAuthentication(resData)
        })
      );
  }
  private handleAuthentication(response) {
    const { token } = response
    const user = new UserToken(token);
    this.usertoken.next(user);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.log("here");
      // alert(error.error.non_field_errors);
      // alert("Email or password is incorrect.");
      // this.toastr.error("Email or password is incorrect.")


    }
    // return an observable with a user-facing error message
    console.log(error);
    this.toastr.error("Something bad happened; please try again later.")
    return throwError(
      'Something bad happened; please try again later.');
  }

  // Send token to the email whose user has forgot the password.
  sendtokenemail(email){
    return this.http
    .post<AuthResponseData>("http://127.0.0.1:8000/accounts/password-reset/", {
      email,
    })
    .pipe(
      catchError(this.handleError)
    );
  }
  // Verify token entred by user who forgot passwords
  verifytoken(token){
    return this.http
    .post<AuthResponseData>("http://127.0.0.1:8000/accounts/password-reset/validate_token/", {
      token,
    })
    .pipe(
      catchError(this.handleError)
    );
  }
  // Reset password
  resetpassword(password,token){
    return this.http
    .post<AuthResponseData>("http://127.0.0.1:8000/accounts/password-reset/confirm/", {
    password,  
    token,
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  isAuthenticated() {
    return this.authenticated;
  }

  setAuthenticated() {
    this.authenticated=!this.authenticated
  }



  logout() {
    this.authenticated = false;
    console.log("logout of email" + localStorage.getItem('authenticatedUserEmail'));
    localStorage.removeItem('authenticatedUserEmail');
    localStorage.removeItem('userConnectedId');
    localStorage.removeItem('userConnectedAssignProfile');
    localStorage.removeItem('userConnectedAssignRole');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('parentRoleUserId');
    localStorage.removeItem('demandConfirmation');

    
    this.usertoken.next(null)
    this.router.navigate(["/auth"]);
  }

}

//   signup(email: string, password: string) {
//     return this.http
//       .post<AuthResponseData>(
//         'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDb0xTaRAoxyCgvaDF3kk5VYOsTwB_3o7Y',
//         {
//           email: email,
//           password: password,
//           returnSecureToken: true
//         }
//       )
//       .pipe(
//         catchError(errorRes => {
//           let errorMessage = 'An unknown error occurred!';
//           if (!errorRes.error || !errorRes.error.error) {
//             return throwError(errorMessage);
//           }
//           switch (errorRes.error.error.message) {
//             case 'EMAIL_EXISTS':
//               errorMessage = 'This email exists already';
//           }
//           return throwError(errorMessage);
//         })
//       );
//   }
