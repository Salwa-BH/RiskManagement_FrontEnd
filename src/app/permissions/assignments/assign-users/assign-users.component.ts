import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Role } from "src/app/models/permissions/Role.model"
import { Profile } from "src/app/models/permissions/Profile.model"
import { Group } from "src/app/models/permissions/Group.model"
import { User } from "../../../models/permissions/User.model"
import { UserAssign } from "../../../models/permissions/UserAssign"

import { RolesService } from '../../services/roles.service'
import { ProfilesService } from '../../services/profiles.service'
import { GroupesService } from "../../services/groupes.service"
import { UserAssignService } from "../../services/user-assign.service"
import { UsersService} from "../../services/users.service"

import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators'

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-users',
  templateUrl: './assign-users.component.html',
  styleUrls: ['./assign-users.component.css']
})
export class AssignUsersComponent implements OnInit {
  @ViewChild("userval") uservalInput: ElementRef;

  form: FormGroup
  type: string

  roles: Role[]
  profiles: Profile[]
  groups: Group[]
  users: User[]

  //filtered
  filteredRoles: Observable<Role[]>;
  filteredProfiles: Observable<Profile[]>;
  filteredGroups: Observable<Group[]>;
  filteredUsers: Observable<User[]>;

  // selectedUsers
  selectedUsers: User[] = [];
  addedUsers: User[] = [];
  deletedUsers: User[] = [];

  constructor(private roleService: RolesService, 
    private profileService: ProfilesService,
    private groupService: GroupesService,
    private userAssignService: UserAssignService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<AssignUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      // Role
    if(this.data?.type.match("role")!=null){
      this.type="role";
    } 
        // Profile
    if(this.data?.type.match("profile")!=null){
      this.type = "profile"
    }

      // Group
    if(this.data?.type.match("group")!=null){
      this.type="group";
    } 

     // Assign Groups to profile
     if(this.data?.type.match("profile-group")!=null){
      this.type="profile-group";
    } 
    
    this.form = new FormGroup({
      user: new FormControl(""),
      role: new FormControl(""),
      profile: new FormControl(""),
      group: new FormControl("")
    });
  }

  ngOnInit(): void {
    this.refreshDataRole();
    this.refreshDataProfile();
    this.refreshDataGroup();
    this.refreshDataUser();
  }

  // User
  refreshDataUser(){
    this.userService.getUsers().subscribe((data) =>{
      this.users = data;
      this.filteredUsers = this.form
        .get("user")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this.filterUsers(value))
        );
    });
  }
  private filterUsers(value: any): User[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }

    if (this.users && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.username.toLowerCase();
      return this.users.filter((user) =>
        user.username.toLowerCase().includes(filterValue)
      );
    }

    return this.users;
  }

  displayUser(user: User): string {
    return  user && user.username ? user.username : "";
  }

  // Selected Users
  onSelectUser(user) {
   
    // If user already exists don't add it to selected risks array
    if (user && !this.selectedUsers.find((r) => user.id === r.id)) {
      // this is only for showing the selected products on the component
      this.selectedUsers.push(user);
      this.addedUsers.push(user);
      
      // cancel user
      this.deletedUsers = this.deletedUsers.filter(
        (dr) => dr.id !== user.id
      );
  
      // if this user isn t already a acton plan s user,create it, otherwise, ignore it
      // if (this.data.editedRisk && typeof this.originalRiskAction.find(
      //     (r) => r.risk_id === user.id
      //   ) === "undefined"
      // ) {
      //   this.addedUsers.push(user);
      // }
    }
  
    // clear the input box
    this.form.get("user").reset();
    // remove focus from the box, so the box can be clickable again
    // if not the list of the risks won't show
    this.uservalInput.nativeElement.blur();
    console.log(this.addedUsers);
  }

  onRemoveUser(user) {
  
    //  Remove it from the displayed risks array
    this.selectedUsers = this.selectedUsers.filter(
      (r) => r.id !== user.id
    );

    // Cancel the scheduled user creation
    this.addedUsers = this.addedUsers.filter(
      (rp) => rp.id !== user.id
    );

    // Schedule the user deletion, if it is already stored on the database
    // if (
    //   this.data.actionPlan &&
    //   typeof this.originalRiskAction.find(
    //     (rp) => rp.risk_id === user.id
    //   ) !== "undefined"
    // ) {

       //this.deletedUsers.push(user);
    //}
  }

  // ROLE
  refreshDataRole(){
    this.roleService.getRoles().subscribe((data) =>{
      this.roles = data;
      this.filteredRoles = this.form
        .get("role")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this.filterRoles(value))
        );
    });
  }
  private filterRoles(value: any): Role[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }

    if (this.roles && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.name.toLowerCase();
      return this.roles.filter((role) =>
        role.name.toLowerCase().includes(filterValue)
      );
    }

    return this.roles;
  }

  displayRole(role: Role): string {
    return  role && role.name ? role.name : "";
  }

  // Profile
  refreshDataProfile(){
    this.profileService.getProfiles().subscribe((data) =>{
      this.profiles = data;
      this.filteredProfiles = this.form
        .get("profile")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this.filterProfiles(value))
        );
    });
  }
  private filterProfiles(value: any): Profile[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }

    if (this.profiles && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.name.toLowerCase();
      return this.profiles.filter((profile) =>
        profile.name.toLowerCase().includes(filterValue)
      );
    }

    return this.profiles;
  }

  displayProfile(profile: Profile): string {
    return  profile && profile.name ? profile.name : "";
  }

  // group
  refreshDataGroup(){
    this.groupService.getGroups().subscribe((data) =>{
      this.groups = data;
      this.filteredGroups = this.form
        .get("group")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this.filterGroups(value))
        );
    });
  }
  private filterGroups(value: any): Group[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }

    if (this.groups && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.name.toLowerCase();
      return this.groups.filter((group) =>
        group.name.toLowerCase().includes(filterValue)
      );
    }

    return this.groups;
  }

  displayGroup(group: Group): string {
    return  group && group.name ? group.name : "";
  }

  // Add selected users to type
  create(){
    const { role,profile,group } = this.form.value;
    // If both users and one of the assignment are not empty
    if (this.selectedUsers.length!=0 && !(role==="" && profile==="" && group==="")) {
     // Get all userAssignments, compare them with the id of the users, then edit the selected one 
    this.userAssignService.getUserAssignments().subscribe( data => {
      this.selectedUsers.forEach( u => {
        let assign  = data.find( a => a.user_id == u.id)
        // if the user already has an assignment, edit it
        if(assign){
              let userAssign = new UserAssign(assign.user_id, assign.role_id,assign.profile_id,assign.group_id);
              // If the role changed
              if(this.type.match('role')){
                userAssign = new UserAssign(u.id, role.id, assign.profile_id, assign.group_id);
              }
              // If the profile changed
              if(this.type.match('profile')){
                userAssign = new UserAssign(u.id, assign.role_id, profile.id, assign.group_id);
              }
              // If the group changed
              if(this.type.match('group')){
                userAssign = new UserAssign(u.id, assign.role_id, assign.profile_id, group.id);
              } 
              this.userAssignService.editUserAssign(assign.id,userAssign)
        }

        // If the user doesn't have an assessment
        else{
              const userAssign = new UserAssign(u.id, role.id,profile.id,group.id);
              this.userAssignService.createUserAssign(userAssign)
        }
      })
    })

    this.dialogRef.close();
      
    } else {
      alert("Please complete the required fields !");
    }    
  }

  // Assign Group to Profile
  assignGroupToProfile(){
    const { profile,group } = this.form.value;
    // If profile and group are empty 
    if ( !(profile==="" || group==="")) {
     // Get all userAssignments, compare their group id, then edit the selected ones 
    this.userAssignService.getUserAssignments().subscribe( data => {
        // if user is part of the group
        data.forEach( u => {
          if(u.group_id == group.id ){
            let assign = new UserAssign(u.user_id,u.role_id,profile.id,u.group_id)
            this.userAssignService.editUserAssign(u.id,assign)
          }
        })
      })
    this.dialogRef.close();
      
    } else {
      alert("Please complete the required fields !");
    }    
  }

  // Close
  onCloseDialog() {
    this.dialogRef.close();
  }

}
