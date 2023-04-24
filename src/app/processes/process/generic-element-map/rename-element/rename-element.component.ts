import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessService } from "src/app/processes/process.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  templateUrl: "./rename-element.component.html",
  styleUrls: ["./rename-element.component.css"],
})
export class RenameElementComponent implements OnInit {
  renameForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RenameElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService
  ) {
    this.renameForm = new FormGroup({
      title: new FormControl(data?.process.title, Validators.required),
    });
  }

  ngOnInit(): void {}

  onValidate() {
    this.processService
      .renameProcess(this.data.process.id, this.renameForm.value.title)
      .subscribe(
        (success) => {
          this.onCloseDialog({
            isSuccess: true,
            newTitle: this.renameForm.value.title,
          });
          this.processService.refreshProcesses();
        },
        (err) => alert("There was an error while trying to rename the element")
      );
  }

  onCloseDialog(result: { newTitle: string; isSuccess: boolean }) {
    this.dialogRef.close(result);
  }
}
