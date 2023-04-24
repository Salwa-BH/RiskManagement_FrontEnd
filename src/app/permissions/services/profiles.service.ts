import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';

import { Profile } from "../../models/permissions/Profile.model"

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  profile_url = "api/profile/"
  profilesChanged = new Subject<Profile[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getProfiles(){
    return this.http.get<Profile[]>(this.profile_url)
  }
  createProfile(profile: Profile) {
    this.http
      .post<Profile>(this.profile_url, profile)
      .subscribe((data) => this.refreshProfiles());
  }
  getProfile(profileId: number) {
    return this.http.get<Profile>(this.profile_url + profileId + "/");
  }
  deleteProfile(profileId: number) {
    this.http
      .delete(this.profile_url +  profileId + "/")
      .subscribe((data) => this.refreshProfiles());
  }
  editProfile(profileId: number, profile: Profile) {
    this.http
      .put<Profile>(this.profile_url +  profileId + '/', profile)
      .subscribe((data) => this.refreshProfiles());
  }
  refreshProfiles() {
    this.getProfiles().subscribe((data) => this.profilesChanged.next(data));
  }
}
