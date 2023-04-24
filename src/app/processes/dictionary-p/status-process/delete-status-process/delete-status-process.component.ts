import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProcessService } from "../../../process.service";


@Component({
  selector: 'app-delete-status-process',
  templateUrl: './delete-status-process.component.html',
  styleUrls: ['./delete-status-process.component.css']
})
export class DeleteStatusProcessComponent implements OnInit {

  constructor(  private processService: ProcessService,
    public dialogRef: MatDialogRef<DeleteStatusProcessComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onConfirmDeletion() {
    this.processService
      .deletestatusP(this.data?.status.id)
      .subscribe(() => {this.onCloseDialog();this.toastr.success('Status deleted',this.data?.status.name);});
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
