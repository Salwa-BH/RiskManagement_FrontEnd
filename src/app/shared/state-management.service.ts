import { Injectable } from "@angular/core";
import { CompanySite } from "../models/processes/CompanySite.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CompanyService } from "./company.service";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StateManagementService {
  currentCompanySite: CompanySite;

  companySiteSub = new Subject<CompanySite>();

  constructor(private companyService: CompanyService) {
    this.initService();
  }

  /* Setting Service Initial Data */
  private initService() {
    // Loading default company site
    this.companyService.getDefaultCompanySite().subscribe((data) => {
      this.currentCompanySite = data[0];
    });
  }

  /* Useful when a user switches company site */
  setCurrentCompanySite(newCompanySite: CompanySite): void {
    this.currentCompanySite = newCompanySite;
    this.companySiteSub.next(newCompanySite);
    // console.log(newCompanySite);
  }

  getCurrentCompanySite(): Promise<CompanySite> {
    return new Promise((resolve) => {
      if (this.currentCompanySite) {
        resolve(this.currentCompanySite);
      } else {
        this.companyService.getDefaultCompanySite().subscribe((data) => {
          resolve(data[0]);
        });
      }
    });
  }
}
