import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CompanySite } from "../models/processes/CompanySite.model";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  companySitesSub: Subject<CompanySite> = new Subject();


  constructor(private http: HttpClient, private router: Router) {}

  createCompanySite(companySite: CompanySite): Observable<CompanySite> {
    return this.http
      .post<CompanySite>("/api/company-site/", companySite)
      .pipe(tap((data) => this.companySitesSub.next(data)));
  }

  getCompanySites(): Observable<CompanySite[]> {
    return this.http.get<CompanySite[]>("/api/company-site/");
  }

  getCompanySite(companySiteId: number): Observable<CompanySite> {
    return this.http.get<CompanySite>(`/api/company-site/${companySiteId}/`);
  }

  getDefaultCompanySite(): Observable<CompanySite[]> {
    return this.http.get<CompanySite[]>("/api/company-site/?is_default=true");
  }

  setDefaultCompanySite(newDefaultCompanySiteId: number) {
    return new Promise<void>((resolve) => {
      // Get current default company site
      this.getDefaultCompanySite().subscribe((currentDefaultSite) => {
        if (currentDefaultSite.length !== 0) {
          //  Unset current default company site
          this.updateCompanySiteStatus(
            currentDefaultSite[0].id,
            false
          ).subscribe((updated) => {
            //  Set newer default company site
            this.updateCompanySiteStatus(
              newDefaultCompanySiteId,
              true
            ).subscribe((updated) => {
              resolve();
            });
          });
        } else {
          this.updateCompanySiteStatus(newDefaultCompanySiteId, true).subscribe(
            (updated) => {
              alert("Please reload the app");
              resolve();
            }
          );
        }
      });
    });
  }

  renameCompanySite(
    companySiteId: number,
    newName: string
  ): Observable<CompanySite> {
    return this.http.patch<CompanySite>(`/api/company-site/${companySiteId}/`, {
      name: newName,
    });
  }
  
  updateCompanySiteStatus(
    companySiteId: number,
    is_default: boolean
  ): Observable<CompanySite> {
    return this.http.patch<CompanySite>(`/api/company-site/${companySiteId}/`, {
      is_default,
    });
  }

  deleteCompanySite(companySiteId: number): Observable<Object> {
    return this.http.delete(`/api/company-site/${companySiteId}/`);
  }
}
