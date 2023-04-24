import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserAssignService } from "../../services/user-assign.service"
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  
  constructor( 
      private userAssignService: UserAssignService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }
  onConfirmDeletion() {
    this.userAssignService.deleteUserAssign(this.data?.userAssign.id);
    this.onCloseDialog();
    this.toastr.success('Relation deleted');
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
