import { Component, OnInit } from "@angular/core";
import { CompanySite } from "src/app/models/processes/CompanySite.model";
import { Subscription } from "rxjs";
import { CompanyService } from "src/app/shared/company.service";
import { MatDialog } from "@angular/material/dialog";
import { EditCompanySiteComponent } from "./edit-company-site/edit-company-site.component";
import { DeleteCompanySiteComponent } from "./delete-company-site/delete-company-site.component";

@Component({
  selector: "app-company-sites",
  templateUrl: "./company-sites.component.html",
  styleUrls: ["./company-sites.component.css"],
})
export class CompanySitesComponent implements OnInit {
  companySites: CompanySite[]=[];
  companySitesSub: Subscription;
p=1;
  constructor(
    private companySiteService: CompanyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.companySiteService.getCompanySites().subscribe((data) => {
      this.companySites = data;
      this.companySites.sort((site1, site2) => {
        if (site1.id > site2.id) return 1;
        return -1;
      });
    });
  }

  edit(event) {
    this.companySiteService
      .getCompanySite(+event.target.id)
      .subscribe((site) => {
        const dialogRef = this.dialog.open(EditCompanySiteComponent, {
          width: '300px',
          data: { site, siteId: +event.target.id },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData()
        });
      });
  }

  delete(event) {
    this.companySiteService
      .getCompanySite(+event.target.id)
      .subscribe((site) => {
        let dialogRef = this.dialog.open(DeleteCompanySiteComponent, {
          data: { site, siteId: +event.target.id },
        });

        dialogRef.afterClosed().subscribe((deleted) => this.refreshData())
      });
  }

  add() {
    const dialogRef = this.dialog.open(EditCompanySiteComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((added) => this.refreshData())
  }

  makeDefaultSite(siteId) {
    this.companySiteService
      .setDefaultCompanySite(+siteId)
      .then((updated) => this.refreshData());
  }
}
