import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { Permission } from "../../models/permissions/Permission.model"

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  permission_url = "api/permissions/"
  permissionsChanged = new Subject<Permission[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPermissions(){
    return this.http.get<Permission[]>(this.permission_url)
  }
  createPermission(permission: Permission) {
    this.http
      .post<Permission>(this.permission_url, permission)
      .subscribe((data) => this.refreshPermissions());
  }
  getPermission(permissionId: number) {
    return this.http.get<Permission>(this.permission_url + permissionId + "/");
  }
  deletePermission(permissionId: number) {
    this.http
      .delete(this.permission_url +  permissionId + "/")
      .subscribe((data) => this.refreshPermissions());
  }
  editPermission(permissionId: number, permission: Permission) {
    this.http
      .put<Permission>(this.permission_url +  permissionId + '/', permission)
      .subscribe((data) => this.refreshPermissions());
  }
  refreshPermissions() {
    this.getPermissions().subscribe((data) => this.permissionsChanged.next(data));
  }
}
