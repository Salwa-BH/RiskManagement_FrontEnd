import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { tap } from "rxjs/operators";

import { Role } from "../../models/permissions/Role.model"

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  rolesChanged = new Subject<Role[]>();

  role_url = "/api/role/"

  constructor(private http: HttpClient, private router: Router) { }

  // ROLE

  // createRole(role: Role){
  //   this.http
  //     .post<Role>(this.role_url+ "/", role)
  //     .subscribe((data) => this.refreshRoles());
  // }

  createRole(role: Role, parent: number) {
    let endpoint =  `api/role/${parent}/add_child/`;
    if(parent == 0){
      endpoint ="api/role/";
    } 
    return this.http.post(endpoint, role ).subscribe(
      result => console.log(result),
        error => {
            console.log(error)
        });
  }

  getRoles(){
    return this.http.get<Role[]>(this.role_url)
  }
  
  getRole(RoleId: number) {
    return this.http.get<Role>(this.role_url + RoleId + "/");
  }
  deleteRole(roleId: number) {
    this.http
      .delete(this.role_url + roleId + "/")
      .subscribe((data) => this.refreshRoles());
  }
  editRole(roleId: number, role: Role) {
    this.http
      .put<Role>(this.role_url + roleId + '/', role)
      .subscribe((data) => this.refreshRoles());
  }
  refreshRoles() {
    this.getRoles().subscribe((data) => this.rolesChanged.next(data));
  }

}
