import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';

import { WebsiteStructure } from "../../models/permissions/WebsiteStructure.model"

@Injectable({
  providedIn: 'root'
})
export class WebsiteStructureService {

  websiteStructuresChanged = new Subject<WebsiteStructure[]>();

  websiteStructure_url = "/api/website-structure/"

  constructor(private http: HttpClient, private router: Router) { }

  // WEBSITE STRUCTURE

  getWebsiteStructures(){
    return this.http.get<WebsiteStructure[]>(this.websiteStructure_url)
  }
  createWebsiteStructure(websiteStructure: WebsiteStructure){
    this.http
      .post<WebsiteStructure>(this.websiteStructure_url+ "/", websiteStructure)
      .subscribe((data) => this.refreshWebsiteStructures());
  }
  getWebsiteStructure(WebsiteStructureId: number) {
    return this.http.get<WebsiteStructure>(this.websiteStructure_url + WebsiteStructureId + "/");
  }
  deleteWebsiteStructure(websiteStructureId: number) {
    this.http
      .delete(this.websiteStructure_url + websiteStructureId + "/")
      .subscribe((data) => this.refreshWebsiteStructures());
  }
  editWebsiteStructure(websiteStructureId: number, websiteStructure: WebsiteStructure) {
    this.http
      .put<WebsiteStructure>(this.websiteStructure_url + websiteStructureId + '/', websiteStructure)
      .subscribe((data) => this.refreshWebsiteStructures());
  }
  refreshWebsiteStructures() {
    this.getWebsiteStructures().subscribe((data) => this.websiteStructuresChanged.next(data));
  }
}
