import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; 
import { map, startWith } from 'rxjs/operators'
import { Observable } from "rxjs";

import { UserAssign } from "../../../models/permissions/UserAssign"
import { Role } from "../../../models/permissions/Role.model"
import { Profile } from "../../../models/permissions/Profile.model"
import { Group } from "../../../models/permissions/Group.model"
import { User } from "../../../models/permissions/User.model"

import { UserAssignService } from "../../services/user-assign.service"
import { UsersService} from "../../services/users.service"
import { RolesService } from "../../services/roles.service"
import { ProfilesService } from "../../services/profiles.service"
import { GroupesService} from "../../services/groupes.service"

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  form: FormGroup

  roles: Role[]
  profiles: Profile[]
  groups: Group[]
  users: User[]

  username='';
  //filtered
  filteredRoles: Observable<Role[]>;
  filteredProfiles: Observable<Profile[]>;
  filteredGroups: Observable<Group[]>;
  filteredUsers: Observable<User[]>;

  constructor(
    private userAssignService: UserAssignService,
      private roleService: RolesService, 
      private profileService: ProfilesService,
      private groupService: GroupesService,
      private userService: UsersService,
      public dialogRef: MatDialogRef<EditUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data?.userAssign) {
      this.form = new FormGroup({
        user: new FormControl(data.us, Validators.required),
        role: new FormControl(data.rl),
        profile: new FormControl(data.pr),
        group: new FormControl(data.gr)
      });
    } 
    else {
      this.form = new FormGroup({
        user: new FormControl("", Validators.required),
        role: new FormControl(""),
        profile: new FormControl(""),
        group: new FormControl("")
      });
    }
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
 

  create(){
    if (this.form.valid) {
      const { user,role,profile,group } = this.form.value;
      const userAssign = new UserAssign(user.id, role.id,profile.id,group.id);
      this.userAssignService.createUserAssign(userAssign)
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }    
  }


  edit(){
    if( this.form.valid){
      const { user,role,profile,group } = this.form.value;
      const userAssign = new UserAssign(user.id, role.id,profile.id,group.id);
      console.log(this.data?.userAssign)
      this.userAssignService.editUserAssign(this.data?.id,userAssign)
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }    
    
  }

  getUsername(id:number){
    if(id){
    return this.users.find((user) => user.id == id).username;
    }else{
      return ""
    }
  }
  getRoleName(id:number){
    if(id){
      return this.roles.find((role) => role.id == id).name;
    }else{
      return ""
    }
  }
  getProfileName(id:number){
    if(id){
    return this.profiles.find((profile) => profile.id == id).name;
    }else{
      return ""
    }
  }
  getGroupName(id:number){
    if(id){
    return this.groups.find((group) => group.id == id).name;
    }else{
      return ""
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
