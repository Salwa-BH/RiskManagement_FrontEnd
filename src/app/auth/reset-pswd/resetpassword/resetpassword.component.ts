import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService,  } from "../../auth.service";
import { Router } from "@angular/router";
import {ActivatedRoute} from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
})
export class ResetpasswordComponent implements OnInit {

  //token = localStorage.getItem("forgot-password-token");
  token
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private appcompoenent: AppComponent) { }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.token = event.token;
      this.token=this.token.substring(1);
      console.log(this.token);
     });
  }
 
  onSubmit(authFormReset: NgForm){
    const password1 = authFormReset.value.password1;
    const password2 = authFormReset.value.password2;
    const token1 = this.token;
    console.log("password1 " + password1 + " ps2 " + password2 + " token "+this.token);
    if(password1.match(password2)!=null){
      this.authService.resetpassword(password1,token1).subscribe(
        (resData) => {
          console.log("resDATA is " +resData);
          // Store email of connected user
          alert(" Password is reset successfully");
          this.router.navigate(["/auth"]);
        },
        (errorMessage) => {
          alert("This password is too common.")
          console.log("errorMessage is "+errorMessage);
        }
      );
    }
    else{
      alert("Passwords don't match");
    }

  } 

}
