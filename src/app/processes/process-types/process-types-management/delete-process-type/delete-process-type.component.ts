import { Component, OnInit, Inject } from '@angular/core';
import { ProcessType } from 'src/app/models/processes/ProcessType.model';
import { ProcessTypesService } from '../../process-types.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-process-type',
  templateUrl: './delete-process-type.component.html',
  styleUrls: ['./delete-process-type.component.css']
})
export class DeleteProcessTypeComponent implements OnInit {
  constructor(
    private processTypeService: ProcessTypesService,
    public dialogRef: MatDialogRef<DeleteProcessTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirmDeletion() {
    this.processTypeService
      .deleteProcessType(this.data?.typeId)
      .subscribe((deleted) => this.onCloseDialog());
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
