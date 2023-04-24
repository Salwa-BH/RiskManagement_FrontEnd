import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Status_Process } from "src/app/models/processes/ProcessStatus.model";
import { ProcessService } from "src/app/processes/process.service";

@Component({
  templateUrl: "./change-element-status.component.html",
  styleUrls: ["./change-element-status.component.css"],
})
export class ChangeElementStatusComponent implements OnInit {
    
 filteredstatus:Observable<Status_Process[]>;
 originalstatus:Status_Process[];
  changeStatusForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChangeElementStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService
  ) {
    this.changeStatusForm = new FormGroup({
      status: new FormControl(data?.process.status, Validators.required),
    });

    this.changeStatusForm.controls['status'].setValue({name:this.data?.process.status});
  }

  ngOnInit(): void {

    //status
    this.processService.getstatusPs().subscribe((status)=>{
      this.originalstatus=status;
      this.filteredstatus=this.changeStatusForm.get("status").valueChanges.pipe(
        startWith(""),
        map((value)=> this._filter3(value))
      );
    })
  }

  displayFn3(status:Status_Process): string {
    return status?.name ? status?.name :"";
  }
  private _filter3(value: any):Status_Process[] {
    if (this.originalstatus&& value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.name.toLowerCase();
      return this.originalstatus.filter((status) =>
        status.name.toLowerCase().includes(filterValue)
      );
    }
 
    return this.originalstatus;
  }
  onValidate() {
    this.processService
      .changeProcessStatus(
        this.data.process.id,
        this.changeStatusForm.value.status.name
      )
      .subscribe(
        (success) => this.onCloseDialog({
          isSuccess: true,
          newStatus: this.changeStatusForm.value.status.name
        }),
        (err) =>
          alert(
            "There was an error while trying to change the element's status"
          )
      );
  }

  onCloseDialog(result: {
    newStatus: string,
    isSuccess: boolean,
  }) {
    this.dialogRef.close(result);
  }
}
