import { Component, OnInit,OnChanges, SimpleChanges, DoCheck , ViewChild} from '@angular/core';
import { map, startWith } from 'rxjs/operators'
import { Observable } from "rxjs";
import { FormGroup, FormControl, Validators, RequiredValidator } from "@angular/forms";
import {MatTable} from "@angular/material/table";

import { Profile } from "../../models/permissions/Profile.model"
import { ProfilesService } from "../services/profiles.service"
import { WebsiteStructure } from "../../models/permissions/WebsiteStructure.model"
import { WebsiteStructureService } from "../services/website-structure.service"
import { Permission } from "../../models/permissions/Permission.model"
import { PermissionsService } from "../services/permissions.service"
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  form: FormGroup
  profiles: Profile[]=[]
  structures: WebsiteStructure[]=[]
  permissions: Permission[]=[]
  newPermissions: Permission[] =[]
  
  id: number;
  filteredProfiles: Observable<Profile[]>;

  //@ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private profileService: ProfilesService,
    private websiteService: WebsiteStructureService,
    private permissionService: PermissionsService,
    private toastr: ToastrService,
  ) { 
    this.form = new FormGroup({
    profile: new FormControl(3,Validators.required)  });
  }
  
  ngOnInit(): void {
    this.refreshDataProfile();
    this.refreshDataWebsite();
    this.refreshDataPermission();
    if(this.id){
      this.FillNewPermissions(this.id)
    }
  }
  
  refreshDataWebsite(){
    this.websiteService.getWebsiteStructures().subscribe((data) =>{
      this.structures = data;
      // fill table of list of promises
      this.newPermissions =[]
      this.structures.forEach((structure) => {
        const permission = new Permission(0,structure.id,false,false,false,false)
        this.newPermissions.push(permission)
      })

    })
  }
  refreshDataPermission(){
    this.permissionService.getPermissions().subscribe((data) => {this.permissions = data;})
  }
  
  submitProfile(){
    if(this.form.valid){
    const { profile } = this.form.value 
    const profile2 = this.profiles.find( profil => profil.id == profile.id)
    if( profile2 != undefined) {
      this.id=profile2.id;
      this.FillNewPermissions(profile2.id)
    }else{
      this.toastr.error("There is no such profile")
    }}
  }
  FillNewPermissions(id){
    const { profile } = this.form.value 
    // If we already have permissions associated to this profile, because if not, we use newPermissions without modification
    if(this.permissions.find( perm => perm.profile_id == profile.id)!=undefined){
      // this.newPermissions = []
      // this.permissions.forEach( p => {
      //   if ( p.profile_id == id){
      //     this.newPermissions.push(p)
      //   }
      // })
      this.refreshDataPermission();
      this.permissions.forEach( p => {
        if ( p.profile_id == id){
          this.newPermissions.forEach( n => {
              if(n.structure_id == p.structure_id){
                n.profile_id=id;
                n.read=p.read; n.create= p.create;
                n.edit=p.edit; n.erase=p.erase;
              }
          })
          //this.newPermissions.push(p)
        }
      }); 
    }else{
    this.refreshDataWebsite();
    }
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

  isChecked(bool: boolean){
    if(bool){
      return true
    }
    else{
      return false
    }
  }
  
  readChecked(id){
    this.newPermissions.forEach( p => {
      if( p.structure_id == id ){
        p.read = !p.read;
      }
    })
    return this.newPermissions.find((permission) => permission.structure_id == id).read
  }
  createChecked(id){
    // Do the modification on array NewPermissions
    this.newPermissions.forEach( p => {
      if( p.structure_id == id ){
        p.create = !p.create;
      }
    })
    //return value of create of id 
    return this.newPermissions.find((permission) => permission.structure_id == id).create;
  }
  editChecked(id){
    this.newPermissions.forEach( p => {
      if( p.structure_id == id ){
        p.edit = !p.edit;
      }
    })
    return this.newPermissions.find((permission) => permission.structure_id == id).edit;
  }
  eraseChecked(id){
    this.newPermissions.forEach( p => {
      if( p.structure_id == id ){
        p.erase = !p.erase;
      }
    })
    return this.newPermissions.find((permission) => permission.structure_id == id).erase;
  }
  checkRow(id){
    this.newPermissions.forEach( p => {
      if( p.structure_id == id ){
        p.read = !p.read;
        p.create = !p.create;
        p.edit = !p.edit;
        p.erase = !p.erase;
      }
    })
  }
  save(){
    // If profile is chosen
    if( this.form.valid){
      const {profile} = this.form.value;
      const profile2 = this.profiles.find( profil => profil.id == profile.id)
      // If profile exists 
      if( profile2 != undefined) {
        
        // If this is the first time that we assign permissions to this profile 
        if( this.permissions.find((permission) => permission.profile_id == profile2.id) == undefined ){
          this.newPermissions.forEach(( p ) => {
            p.profile_id = profile2.id
            this.permissionService.createPermission(p);
          })
          this.toastr.success('Permissions granted successfully');
        }
        // If things are already assigned to this profile
        else{
          this.newPermissions.forEach(( p ) => {
            p.profile_id = profile.id
            const perm = this.permissions.find((permission) => (permission.profile_id == profile.id) && (permission.structure_id == p.structure_id) )
            this.permissionService.editPermission(perm.id, p);
          })
          this.toastr.success('Relation edited successfully');
        }
      }
      else {
        this.toastr.error("There is no such profile");
      }   
    } else {
      this.toastr.error("Please choose a profile");
    }   

  }

  getStructureName(id:number){
    if(id && this.structures != undefined ) {
    return this.structures.find((str) => str.id == id).structure;
    }else{
      return ""
    }
  }
  getSubStructureName(id:number){
    if(id && this.structures != undefined){
    return this.structures.find((str) => str.id == id).sub_structure;
    }else{
      return ""
    }
  }

}
