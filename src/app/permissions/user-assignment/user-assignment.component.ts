import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { UserAssign } from "../../models/permissions/UserAssign"
import { Role } from "../../models/permissions/Role.model"
import { Profile } from "../../models/permissions/Profile.model"
import { Group } from "../../models/permissions/Group.model"
import { User } from "../../models/permissions/User.model"

import { UserAssignService } from "../services/user-assign.service"
import { RolesService } from "../services/roles.service"
import { ProfilesService } from "../services/profiles.service"
import { GroupesService} from "../services/groupes.service"
import { UsersService} from "../services/users.service"

import { EditUserComponent } from "./edit-user/edit-user.component"
import { DeleteUserComponent } from "./delete-user/delete-user.component"

@Component({
  selector: 'app-user-assignment',
  templateUrl: './user-assignment.component.html',
  styleUrls: ['./user-assignment.component.css']
})
export class UserAssignmentComponent implements OnInit {

  UserAssigns: UserAssign[]
  roles: Role[]
  profiles: Profile[]
  groups: Group[]
  users: User[]
  connectedUserProfile: number
  p=1

  constructor( private userAssignService: UserAssignService,
      private roleService: RolesService, 
      private profileService: ProfilesService,
      private groupService: GroupesService,
      private userService: UsersService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.refreshData();
    this.refreshDataRole();
    this.refreshDataProfile();
    this.refreshDataGroup();
    this.refreshDataUser();
  }

  getAccessControls(){
    console.log(this.users);
    
    const email = localStorage.getItem('authenticatedUserEmail');
    this.userService.getUsers().subscribe( data => {
      data.forEach( u => {
        if(u.email == email){
          this.UserAssigns.forEach( assign => {
            if( assign.user_id == u.id){
              this.connectedUserProfile = assign.profile_id;
              return this.connectedUserProfile;
            }
          })
        }
      })
    })
    
  }
  refreshData(){
    this.userAssignService.getUserAssignments().subscribe((data) =>{
      this.UserAssigns = data;
    })
  }
  refreshDataRole(){
    this.roleService.getRoles().subscribe((data) =>{
      this.roles = data;
    })
  }
  refreshDataUser(){
    this.userService.getUsers().subscribe((data) =>{
      this.users = data;
    })
  }
  refreshDataProfile(){
    this.profileService.getProfiles().subscribe((data) =>{
      this.profiles = data;
    })
  }
  refreshDataGroup(){
    this.groupService.getGroups().subscribe((data) =>{
      this.groups = data;
    })
  }

  edit(event){
    this.userAssignService
    .getUserAssign(+event.target.id)
    .subscribe((userAssign) => {
      // send elements to fill form when editing
      let us = this.users.find( u => u.id == userAssign.user_id)
      let rl = this.roles.find( r => r.id == userAssign.role_id)
      let pr = this.profiles.find( p => p.id == userAssign.profile_id)
      let gr = this.groups.find( g => g.id == userAssign.group_id)
      
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '400px',
        data: { userAssign, id:userAssign.id, us,rl,pr,gr },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.refreshData()
      });
    });
  }
  add(){
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData()
    }); 
  }

  delete(id){
    this.userAssignService.getUserAssign(id).subscribe((userAssign) => {
      console.log(userAssign)
      const dialogSup = this.dialog.open(DeleteUserComponent,{
        width: '400px',
        data: { userAssign },
      }); 
      dialogSup.afterClosed().subscribe((result) => {
        this.refreshData()
      });
    });
  }

  // Get value from id 
  getUsername(id:number){
    if(id){
      if(this.users){
        return this.users.find((user) => user.id == id).username;
      }
      //return this.users.find((user) => user.id == id).username;
    }else{
      return ""
    }
  }
  getRoleName(id:number){
    if(id){
      if(this.roles)
      {return this.roles.find((role) => role.id == id).name;}
    }else{
      return ""
    }
  }
  getProfileName(id:number){
    if(id){
      if(this.profiles)
      {return this.profiles.find((profile) => profile.id == id).name;}
    }else{
      return ""
    }
  }
  getGroupName(id:number){
    if(id){
      if(this.groups)
      {return this.groups.find((group) => group.id == id).name;}
    }else{
      return ""
    }
  }

}
