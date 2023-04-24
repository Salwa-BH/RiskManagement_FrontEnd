import { Component, OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, AuthResponseData } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import {AppComponent} from '../app.component';

import { UsersService} from "../permissions/services/users.service";
import { User } from "../models/permissions/User.model";
import { UserAssignService } from "../permissions/services/user-assign.service";
import { UserAssign } from "../models/permissions/UserAssign"
import { RolesService } from "../permissions/services/roles.service";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnInit {

  error: string;
  public authenticatedUserEmail;

  users: User[]
  usersAssign: UserAssign[]

  userConnectedId; userConnectedAssignProfile;userConnectedAssignRole;

  constructor(private authService: AuthService, 
    private toastr: ToastrService,
    private appcomponent: AppComponent,
    //private userAssignment: UserAssignmentComponent,
    private userService: UsersService,
    private userAssignService: UserAssignService,
    private router: Router,
    private roleService: RolesService) {}

  ngOnInit() {
    // Get all users to find the id of the email connected
    this.userService.getUsers().subscribe( data => {
      this.users = data;
    })
    // Get all Assignments
    this.userAssignService.getUserAssignments().subscribe(data => {
      this.usersAssign = data;
    })
  }

  getAssignments(){
    const email = localStorage.getItem('authenticatedUserEmail');
    // Get email of connected user
    this.users.forEach( u => {
        if(email.match(u.email)){ 
         // get assignment of connected user
         this.usersAssign.forEach( assign => {
            if( assign.user_id == u.id){
              this.userConnectedId = localStorage.setItem('userConnectedId', JSON.stringify(assign.user_id));
              this.userConnectedAssignProfile = localStorage.setItem('userConnectedAssignProfile', JSON.stringify(assign.profile_id));
              this.userConnectedAssignRole = localStorage.setItem('userConnectedAssignRole', JSON.stringify(assign.role_id));
              this.getConfirmation(assign.role_id)
            }
          })
        }
    })
  }
  getConfirmation(userConnectedAssignRole){
    //get id of parent
    this.roleService.getRole(userConnectedAssignRole).subscribe( data =>
      {
        let parentRole = 0;
        // get demand confirmation of connected role
        let demandconfirmation = localStorage.setItem('demandConfirmation', JSON.stringify(data.confirmation));
        //console.log("demand confirmation for this user: " + JSON.parse(localStorage.getItem("demandConfirmation")))
        // get id of parent
        if(data.parents.length){
          parentRole = data.parents.pop().id ; 
          // get get user id of parent
          this.userAssignService.getUserAssignments().subscribe( data => {
            // parent role user id will be set to 0 if it doesn't have a parent
            localStorage.setItem('parentRoleUserId', JSON.stringify(0))
            data.forEach( ass =>{
                // if connected user has a parent parentRole !=0.
                if( ass.role_id == parentRole ){
                    localStorage.setItem('parentRoleUserId', JSON.stringify(ass.user_id))
                }
            });
            console.log("Connected user " + localStorage.getItem("userConnectedId") + " Profile " + localStorage.getItem("userConnectedAssignProfile") + " Role " +localStorage.getItem("userConnectedAssignRole")+ " Parent Role "+ parentRole + " Parent role user id " + localStorage.getItem('parentRoleUserId') +" demand confirmation " + localStorage.getItem("demandConfirmation"));
          });
        } 
      });
  }

  async onSubmit(form: NgForm) {
    //debugger
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.login(email, password);
    
    authObs.subscribe(
      async (resData) => {
        // Store email of connected user
        this.authService.setAuthenticated();
        this.authenticatedUserEmail = email;
        localStorage.setItem('authenticatedUserEmail', JSON.stringify(this.authenticatedUserEmail)); 
        localStorage.setItem('token', resData['access']);
        localStorage.setItem('refresh', resData['refresh']);
        
        // To get profile of the connected user
        this.getAssignments();
        
        this.router.navigate(["/unauthorized"]);
       /*  if( parseInt( localStorage.getItem('userConnectedId')) ==1 ){
          this.router.navigate(["/"]);
         // this.router.navigate(["/risks/characterization"]);
        }
       else if( parseInt( localStorage.getItem('userConnectedId')) ==6 ){
          this.router.navigate(["/notifications"]);
        }
        else{
          this.router.navigate(["/"]);
        }*/
      },
      (errorMessage) => {
        this.toastr.error("Email or password is incorrect.");
        console.log(errorMessage);
        this.error = errorMessage;

      }
    );
    form.reset();
  }

  goToForgotPassword(){

    this.router.navigateByUrl("/forgot-password");
  }
}
