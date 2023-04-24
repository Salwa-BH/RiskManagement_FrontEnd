import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Role } from "src/app/models/permissions/Role.model"
import { Profile } from "src/app/models/permissions/Profile.model"
import { Group } from "src/app/models/permissions/Group.model"

import { RolesService } from '../../services/roles.service'
import { ProfilesService } from '../../services/profiles.service'
import { GroupesService } from "../../services/groupes.service"

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {

  form: FormGroup;
  type:string;
  create_type: boolean;

  selectedParent: number = 0;
  roles: Role[];

  constructor(private roleService: RolesService, 
    private profileService: ProfilesService,
    private groupService: GroupesService,
    public dialogRef: MatDialogRef<EditAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      // Role
    if(this.data?.type.match("role")!=null){
      this.type="role";
      if (this.data?.role) {
        // get id of parent
        if(this.data?.role.parents.length){
          this.selectedParent = this.data?.role.parents.pop().id ; 
        }else{
          this.selectedParent = 0 ;
        }
        this.form = new FormGroup({
          name: new FormControl(data.role.name, Validators.required),
          description: new FormControl(data.role.description),
          parent: new FormControl(this.selectedParent, Validators.required),
          confirmation: new FormControl(data.role.confirmation),
        });
      } else {
        this.create_type=true;
        this.selectedParent=0;
        this.form = new FormGroup({
          name: new FormControl("", Validators.required),
          description: new FormControl(""),
          parent: new FormControl("" , Validators.required),
          confirmation: new FormControl(false),
        }); 
      }       
    } 
        // Profile
    if(this.data?.type.match("profile")!=null){
      this.type = "profile"
      if (this.data?.profile) {
        this.form = new FormGroup({
          name: new FormControl(data.profile.name, Validators.required),
          description: new FormControl(data.profile.description),
        
        });
      } else {
        this.create_type=true
        this.form = new FormGroup({
          name: new FormControl("", Validators.required),
          description: new FormControl(""),
      }); 
      }
    }

      // Group
    if(this.data?.type.match("group")!=null){
      this.type="group";
      if (this.data?.group) {
        this.form = new FormGroup({
          name: new FormControl(data.group.name, Validators.required),
          description: new FormControl(data.group.description),
        
        });
      } else {
        this.create_type=true;
        this.form = new FormGroup({
          name: new FormControl("", Validators.required),
          description: new FormControl(""),
        }); 
      }       
    } 
}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe( roles => {this.roles = roles;});
    if(this.selectedParent==0){
      this.form.get("parent").setValue("0");
    }
    else{this.form.get("parent").setValue(this.selectedParent);}
  }

  create() {
    if (this.form.valid) {
      const { name } = this.form.value;
      const { description } = this.form.value;
      const { parent } = this.form.value;
      const { confirmation } = this.form.value

      if(this.type.match("role")!= null){
        console.log(name, description,confirmation,parent);
        const role = new Role(name,description,confirmation)
        this.roleService.createRole(role, parent);
      }
      if(this.type.match("profile")!= null){
        const profile = new Profile(name, description);
        this.profileService.createProfile(profile);
      }
      if(this.type.match("group")!= null){
        const group = new Group(name, description);
        this.groupService.createGroup(group);
      }
      this.dialogRef.close();

    } else {
      
      alert("Please complete the required fields !");
    }
  }

  // edit() {
  //   if (this.form.valid) {
  //     const { name } = this.form.value;
  //     const { description } = this.form.value
  //     const { confirmation } = this.form.value
  //     // If length too large
  //     if((description.length!=null) && (description.length>300 || name.length>100)  ){
  //       alert("The input is too large for the fields!");
  //     }
  //     // if name already exists
  //     else{
  //       if(this.type.match("role")!= null){
  //         // if(this.roleNameExists()){
  //         //   alert("This name already exists, Please enter a different one");
  //         // } else{
  //           const role = new Role(name,description,confirmation);
  //           this.roleService.editRole(this.data?.role.id,role);
  //       }
  //       if(this.type.match("profile")!= null){
  //         // if(this.profileNameExists()){
  //         //   alert("This name already exists, Please enter a different one");
  //         // } 
  //         // else{
  //           const profile = new Profile(name, description);
  //           this.profileService.editProfile(this.data?.profile.id,profile)
  //         //}
  //       }
  //       if(this.type.match("group")!= null){
  //         // if(this.groupNameExists()){
  //         //   alert("This name already exists, Please enter a different one");
  //         // } 
  //         // else{
  //           const group = new Group(name, description);
  //           this.groupService.editGroup(this.data?.group.id,group)
  //         //}
  //       }
  //     }
  //     this.dialogRef.close();
  //   } else {
  //     alert("Please complete the required fields !");
  //   }
  // }

  edit() {
    if (this.form.valid) {
      const { name } = this.form.value;
      const { description } = this.form.value;
      const { confirmation } = this.form.value;
      // If length too large == undefined
      if( ( description!=null)  &&  (description.length>300 || name.length>100)  ){
        alert("The input is too large for the fields!");
      }
      
      else{
        this.affect(this.type,name,description, confirmation);
      }
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }
  }
  
  affect(type,name,description, confirmation){
    if(type.match("role")!= null){
      const role = new Role( name, description, confirmation);
      this.roleService.editRole(this.data?.role.id,role);
    }
    if(type.match("profile")!= null){
      const profile = new Profile(name, description);
      this.profileService.editProfile(this.data?.profile.id,profile);
    }
    if(type.match("group")!= null){
        const group = new Group(name, description);
        this.groupService.editGroup(this.data?.group.id,group);
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
