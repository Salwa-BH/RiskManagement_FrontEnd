import { Component, OnInit, Inject } from "@angular/core";
import { CompanyService } from "src/app/shared/company.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-company-site",
  templateUrl: "./delete-company-site.component.html",
  styleUrls: ["./delete-company-site.component.css"],
})
export class DeleteCompanySiteComponent implements OnInit {
  constructor(
    private companySiteService: CompanyService,
    public dialogRef: MatDialogRef<DeleteCompanySiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirmDeletion() {
    this.companySiteService
      .deleteCompanySite(this.data?.siteId)
      .subscribe((deleted) => this.onCloseDialog());
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
