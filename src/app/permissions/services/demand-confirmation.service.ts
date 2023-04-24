import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { DemandConfirmation } from 'src/app/models/permissions/DemandConfirmation.model';
import { ToastrService } from "ngx-toastr";

import { RolesService } from './roles.service';
import { UserAssignService } from './user-assign.service';
@Injectable({
  providedIn: 'root'
})
export class DemandConfirmationsService {

  demandConfirmationsChanged = new Subject<DemandConfirmation[]>();
  
  demand_confirmation_url = "/api/demand-confirmation/"

  connectedUser: number= parseInt(localStorage.getItem('userConnectedId'));
  connectedRole :number = parseInt(localStorage.getItem('userConnectedAssignRole'));
  parentRoleUserId: number = parseInt(localStorage.getItem('parentRoleUserId'));
  parentRole: number;
  
  constructor(private http: HttpClient, private router: Router,
    private toastr: ToastrService,
    private roleService: RolesService,
    private userAssignService : UserAssignService) 
    { 
      // to get id of parent role as well 
      this.getConfirmation()
    }

  getConfirmation(){
    //get id of parent
    this.roleService.getRole(this.connectedRole).subscribe( data =>
      {
        // get id of parent
        if(data.parents.length){
          this.parentRole = data.parents.pop().id ; 
          // get get user id of parent
          this.userAssignService.getUserAssignments().subscribe( data => {
            data.forEach( ass =>{
                if( ass.role_id == this.parentRole ){
                  this.parentRoleUserId=ass.user_id;
                }
            });
          });
        } else {
          this.parentRole = 0 ;
        }
      });
  }

  getDemandConfirmations(){
    return this.http.get<DemandConfirmation[]>(this.demand_confirmation_url)
  }
  // createDemandConfirmation(demandConfirmation: DemandConfirmation){
  //   this.http
  //     .post<DemandConfirmation>(this.demand_confirmation_url, demandConfirmation)
  //     .subscribe((data) => {this.refreshDemandConfirmations();
  //       this.toastr.success('Your action is sent to your superior to be confirmed');
  //     });
  // }

  createDemandConfirmation(type: string, action: string, valid: number, update: number){
    //console.log("confirmer"+this.parentRoleUserId)
    this.parentRoleUserId= parseInt(localStorage.getItem('parentRoleUserId'));
    let demandConfirmation : DemandConfirmation = new DemandConfirmation(this.connectedUser, this.parentRoleUserId,type,action,valid,update)
    //console.log(demandConfirmation)
    return this.http.post<DemandConfirmation>(this.demand_confirmation_url, demandConfirmation);
  }

  // createDemandConfirmation(type: string, action: string, valid: number, update: number){
  //   //get id of parent
  //   this.roleService.getRole(this.connectedRole).subscribe( data =>
  //     {
  //       // get id of parent
  //       if(data.parents.length){
  //         this.parentRole = data.parents.pop().id ; 
  //         // get get user id of parent
  //         this.userAssignService.getUserAssignments().subscribe( data => {
  //           data.forEach( ass =>{
  //               if( ass.role_id == this.parentRole ){
  //                 this.parentRoleUserId=ass.user_id;

  //                 let demandConfirmation : DemandConfirmation = new DemandConfirmation(this.connectedUser, this.parentRoleUserId,type,action,valid,update)
  //                 console.log(demandConfirmation)
  //                 return this.http
  //                   .post<DemandConfirmation>(this.demand_confirmation_url, demandConfirmation)
  //                   .subscribe((data) => {this.refreshDemandConfirmations();
  //                     this.toastr.success('Your action is sent to your superior to be confirmed');
  //                   });
  //               }
  //           });
  //         });
  //       } 
  //     });

  //   return null;
  // }
  
  getDemandConfirmation(demandConfirmationId: number) {
    return this.http.get<DemandConfirmation>(this.demand_confirmation_url + demandConfirmationId + "/");
  }
  // deleteDemandConfirmation(demandConfirmationId: number) {
  //   return this.http
  //     .delete(this.demand_confirmation_url + demandConfirmationId + "/")
  //     .subscribe((data) => {this.refreshDemandConfirmations();
  //       this.toastr.success('Deleted successfully');
  //     }).unsubscribe();
  // }
  deleteDemandConfirmation(demandConfirmationId: number) {
    return this.http.delete(this.demand_confirmation_url + demandConfirmationId + "/")
  }
  editDemandConfirmation(demandConfirmationId: number, demandConfirmation: DemandConfirmation) {
    this.http
      .put<DemandConfirmation>(this.demand_confirmation_url + demandConfirmationId + '/', demandConfirmation)
      .subscribe((data) => {this.refreshDemandConfirmations();
        this.toastr.success('Edited successfully');
      });
  }
  refreshDemandConfirmations() {
    this.getDemandConfirmations().subscribe((data) => this.demandConfirmationsChanged.next(data));
  }
}
