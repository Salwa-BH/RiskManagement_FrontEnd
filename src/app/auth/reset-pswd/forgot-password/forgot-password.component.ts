import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService,  } from "../../auth.service";
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {



  constructor(private authService: AuthService, private router: Router, private appcomponent: AppComponent) { }

  ngOnInit(): void {}

  onSubmit(authForm: NgForm) {
    const email = authForm.value.email;
    this.authService.sendtokenemail(email).subscribe(
      (resData) => {
        console.log(resData);
        alert(" An email has been sent to you to restore your password");
        this.router.navigate(["/verify-token"]);
      },
      (errorMessage) => {
        alert("This email is invalid");
        console.log(errorMessage);
      }
    );
  }

}
