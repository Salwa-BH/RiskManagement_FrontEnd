import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';import { Injectable } from '@angular/core';
import { User } from "../../models/permissions/User.model"

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  UsersChanged = new Subject<User[]>();

  user_url = "/api/custom-users/"

  constructor(private http: HttpClient, private router: Router) { }

  // User

  getUsers(){
    return this.http.get<User[]>(this.user_url)
  }
  // createUser(User: User){
  //   this.http
  //     .post<User>(this.user_url+ "/", User)
  //     .subscribe((data) => this.refreshUsers());
  // }
  getUser(userId: number) {
    return this.http.get<User>(this.user_url + userId + "/");
  }
  // deleteUser(userId: number) {
  //   this.http
  //     .delete(this.user_url + userId + "/")
  //     .subscribe((data) => this.refreshUsers());
  // }
  // editUser(userId: number, user: User) {
  //   this.http
  //     .put<User>(this.user_url + userId + '/', user)
  //     .subscribe((data) => this.refreshUsers());
  // }
  refreshUsers() {
    this.getUsers().subscribe((data) => this.UsersChanged.next(data));
  }

  // getAccessControls(){
  //   const email = localStorage.getItem('authenticatedUserEmail');
  //   user: User;
  //   this.getUsers().subscribe( data => {
  //     data.forEach( u => {
  //       if(u.email == email){
  //         user = u;
  //       }
  //     })
      
  //   })
  // }
  
}
