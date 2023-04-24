import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';

import { Group } from "../../models/permissions/Group.model";

@Injectable({
  providedIn: 'root'
})
export class GroupesService {

  groupsChanged = new Subject<Group[]>();
  group_url = "/api/group/"
  constructor(private http: HttpClient, private router: Router) { }

  getGroups(){
    return this.http.get<Group[]>(this.group_url)
  }
  createGroup(group: Group){
    this.http
      .post<Group>(this.group_url+ "/", group)
      .subscribe((data) => this.refreshGroups());
  }
  getGroup(groupId: number) {
    return this.http.get<Group>(this.group_url + groupId + "/");
  }
  deleteGroup(groupId: number) {
    this.http
      .delete(this.group_url + groupId + "/")
      .subscribe((data) => this.refreshGroups());
  }
  editGroup(groupId: number, group: Group) {
    this.http
      .put<Group>(this.group_url + groupId + '/', group)
      .subscribe((data) => this.refreshGroups());
  }
  refreshGroups() {
    this.getGroups().subscribe((data) => this.groupsChanged.next(data));
  }
}
