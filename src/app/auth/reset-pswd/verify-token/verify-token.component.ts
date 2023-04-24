import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService,  } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
})
export class VerifyTokenComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(authFormVerify: NgForm){
    const token = authFormVerify.value.token;
    console.log(token);
    this.authService.verifytoken(token).subscribe(
      (resData) => {
        // Store email of connected user
        localStorage.setItem("forgot-password-token",token);
        this.router.navigate(["/reset-password"]);
      },
      (errorMessage) => {
        alert("This token is invalid");
        console.log(errorMessage);
      }
    );

  } 

}
