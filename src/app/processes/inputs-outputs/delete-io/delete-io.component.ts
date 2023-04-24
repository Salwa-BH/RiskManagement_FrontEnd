import { Component, OnInit, Inject } from '@angular/core';
import { IoService } from '../../io.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-io',
  templateUrl: './delete-io.component.html',
  styleUrls: ['./delete-io.component.css']
})
export class DeleteIoComponent implements OnInit {
  constructor(
    private ioService: IoService,
    public dialogRef: MatDialogRef<DeleteIoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirmDeletion() {
    this.ioService.deleteIoElement(this.data?.ioId);
    this.onCloseDialog();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
