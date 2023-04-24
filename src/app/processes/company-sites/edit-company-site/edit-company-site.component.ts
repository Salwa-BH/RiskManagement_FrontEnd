import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CompanyService } from "src/app/shared/company.service";
import { CompanySite } from "src/app/models/processes/CompanySite.model";

@Component({
  selector: "app-edit-company-site",
  templateUrl: "./edit-company-site.component.html",
  styleUrls: ["./edit-company-site.component.css"],
})
export class EditCompanySiteComponent implements OnInit {
  siteForm: FormGroup;

  constructor(
    private companySiteService: CompanyService,
    public dialogRef: MatDialogRef<EditCompanySiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data?.site) {
      this.siteForm = new FormGroup({
        name: new FormControl(data.site.name, Validators.required),
      });
    } else {
      this.siteForm = new FormGroup({
        name: new FormControl("", Validators.required),
      });
    }
  }

  ngOnInit(): void {}

  createSite() {
    if (this.siteForm.valid) {
      const { name } = this.siteForm.value;
      const companySite = new CompanySite(name, false);
      console.log(companySite);
      this.companySiteService
        .createCompanySite(companySite)
        .subscribe((edited) => this.dialogRef.close());
    } else {
      alert("Please complete the required fields !");
    }
  }

  editSite() {
    if (this.siteForm.valid) {
      const { name } = this.siteForm.value;
      this.companySiteService
        .renameCompanySite(this.data?.siteId, name)
        .subscribe((edited) => this.dialogRef.close());
    } else {
      alert("Please complete the required fields !");
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
