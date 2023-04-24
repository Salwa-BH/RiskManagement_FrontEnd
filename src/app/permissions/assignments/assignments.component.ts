import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { Role } from "../../models/permissions/Role.model"
import { Profile } from "../../models/permissions/Profile.model"
import { Group } from "../../models/permissions/Group.model"

import { RolesService } from "../services/roles.service"
import { ProfilesService } from "../services/profiles.service"
import { GroupesService} from "../services/groupes.service"

import { EditAssignmentComponent } from "./edit-assignment/edit-assignment.component"
import { DeleteAssignmentComponent } from "./delete-assignment/delete-assignment.component"
import { AssignUsersComponent } from "./assign-users/assign-users.component"

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  roles: Role[]
  profiles: Profile[]
  groups: Group[]
  type="Role"
  p=1

  constructor(private roleService: RolesService, 
      private profileService: ProfilesService,
      private groupService: GroupesService,
      public dialog: MatDialog) { }

  ngOnInit(): void {
    this.refreshDataRole();
    this.refreshDataProfile();
    this.refreshDataGroup();
  }

  //  ROLE
  refreshDataRole(){
    this.roleService.getRoles().subscribe((data) =>{
      this.roles = data;
    })
  }
  showRoles(){
    this.type="Role"
  }
 //  PROFILE
  refreshDataProfile(){
    this.profileService.getProfiles().subscribe((data) =>{
      this.profiles = data;
    })
  }
  showProfiles(){
    this.type="Profile"
  }
  //  GROUP
  refreshDataGroup(){
    this.groupService.getGroups().subscribe((data) =>{
      this.groups = data;
    })
  }
  showGroups(){
    this.type = "Group"
  }

  // For Group, Role and Profile
  edit(event){
    if(this.type.match("Role")){
      this.roleService
      .getRole(+event.target.id)
      .subscribe((role) => {
        const dialogRef = this.dialog.open(EditAssignmentComponent, {
          data: { role , type:"role" },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshDataRole()
        });
      });
    }
    if(this.type.match("Profile")){
      this.profileService
    .getProfile(+event.target.id)
    .subscribe((profile) => {
      const dialogRef = this.dialog.open(EditAssignmentComponent, {
        data: { profile , type:"profile" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataProfile()
      });
    });
    }
    if(this.type.match("Group")){
      this.groupService
    .getGroup(+event.target.id)
    .subscribe((group) => {
      const dialogRef = this.dialog.open(EditAssignmentComponent, {
        data: { group , type:"group" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataGroup()
      });
    });
    }
  }

  add(){
    if(this.type.match("Role")){
      const dialogRef = this.dialog.open(EditAssignmentComponent, {
        data: {type:"role" },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataRole()
      }); 
    }
    if(this.type.match("Profile")){
      const dialogRef = this.dialog.open(EditAssignmentComponent, {
        data: {type:"profile"},
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataProfile()
      }); 
    }
    if(this.type.match("Group")){
      const dialogRef = this.dialog.open(EditAssignmentComponent, {
        data: {type:"group"},
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataGroup()
      }); 
    }
  }

  delete(event){
    if(this.type.match("Role")){
      this.roleService.getRole(event.target.id).subscribe((role) => {
        const dialogSup = this.dialog.open(DeleteAssignmentComponent,{
          width: '400px',
          data: { role, type:"role"},
        }); 
        dialogSup.afterClosed().subscribe((result) => {
          this.refreshDataRole()
        });
      });
    }
    if(this.type.match("Profile")){
      this.profileService.getProfile(event.target.id).subscribe((profile) => {
        const dialogSup = this.dialog.open(DeleteAssignmentComponent,{
          width: '400px',
          data: { profile, type:"profile"},
        });  
        dialogSup.afterClosed().subscribe((result) => {
          this.refreshDataProfile()
        });
      });
    }
    if(this.type.match("Group")){
      this.groupService.getGroup(event.target.id).subscribe((group) => {
        const dialogSup = this.dialog.open(DeleteAssignmentComponent,{
          width: '400px',
          data: { group, type:"group"},
        }); 
        dialogSup.afterClosed().subscribe((result) => {
          this.refreshDataGroup()
        });
      });
    }
  }

  assignUsers(){
    if(this.type.match("Role")){
      const dialogRef = this.dialog.open(AssignUsersComponent, {
        data: {type:"role" },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataRole()
      }); 
    }
    if(this.type.match("Profile")){
      const dialogRef = this.dialog.open(AssignUsersComponent, {
        data: {type:"profile"},
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataProfile()
      }); 
    }
    if(this.type.match("Group")){
      const dialogRef = this.dialog.open(AssignUsersComponent, {
        data: {type:"group"},
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshDataGroup()
      }); 
    }
  }

  assignGroups(){
    const dialogRef = this.dialog.open(AssignUsersComponent, {
      data: {type:"profile-group"},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshDataProfile()
    }); 
  }

  changeConfirmation(id){
    this.roleService.getRole(id).subscribe( data => { 
      let role = new Role(data.name, data.description, !data.confirmation);
      this.roleService.editRole(id,role);
      });
  }

}
