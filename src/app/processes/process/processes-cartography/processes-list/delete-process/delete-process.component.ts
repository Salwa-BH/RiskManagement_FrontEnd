import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessService } from "../../../../process.service";

@Component({
  selector: "app-delete-process",
  templateUrl: "./delete-process.component.html",
  styleUrls: ["./delete-process.component.css"],
})
export class DeleteProcessComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService
  ) {}

  ngOnInit() {}

  onDeleteProcess() {
    this.processService.deleteProcess(this.data.deletedProcess.id);
    this.dialogRef.close();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
