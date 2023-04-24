import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse ,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { UserAssign } from "../../models/permissions/UserAssign"

@Injectable({
  providedIn: 'root'
})
export class UserAssignService {

  UserAssignmentsChanged = new Subject<UserAssign[]>();

  userAssign_url = "/api/user-assign/"

  constructor(private http: HttpClient, private router: Router) { }

  // UserAssign

  getUserAssignments(){
    return this.http.get<UserAssign[]>(this.userAssign_url)
  }
  createUserAssign(userAssign: UserAssign){
    this.http
      .post<UserAssign>(this.userAssign_url, userAssign)
      .subscribe((data) => this.refreshUserAssignments());
  }
  
  getUserAssign(userAssignId: number) {
    return this.http.get<UserAssign>(this.userAssign_url + userAssignId + "/");
  }
  deleteUserAssign(userAssignId: number) {
    this.http
      .delete(this.userAssign_url + userAssignId + "/")
      .subscribe((data) => this.refreshUserAssignments());
  }
  editUserAssign(UserAssignId: number, userAssign: UserAssign) {
    this.http
      .put<UserAssign>(this.userAssign_url + UserAssignId + '/', userAssign)
      .subscribe((data) => this.refreshUserAssignments());
  }
  refreshUserAssignments() {
    this.getUserAssignments().subscribe((data) => this.UserAssignmentsChanged.next(data));
  }
}
