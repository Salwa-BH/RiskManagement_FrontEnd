import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProcessService } from "../../../process.service";
import { Status_Process } from 'src/app/models/processes/ProcessStatus.model';
@Component({
  selector: 'app-edit-status-process',
  templateUrl: './edit-status-process.component.html',
  styleUrls: ['./edit-status-process.component.css']
})
export class EditStatusProcessComponent implements OnInit {

  statusForm: FormGroup;

  constructor( public dialogRef: MatDialogRef<EditStatusProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,   private toastr: ToastrService,
    private processService: ProcessService) 
    {
       if (this.data?.status) {
      this. statusForm = new FormGroup({
        name: new FormControl(this.data.status.name, Validators.required),
       
      });
    } else {
      this. statusForm = new FormGroup({
        name: new FormControl("", Validators.required),
  
      });
    } }

  ngOnInit(): void {
  }
  create() {
    if (this.statusForm.valid) {
      let { name} = this.statusForm.value;
      let  status = new Status_Process(name);
      
      this.processService
        .createstatusP(status)
        .subscribe(() =>  this.toastr.success('Status created'))
    


  this.onCloseDialog();
    }
    else{
      this.toastr.error('Please complete the required fields !');
    }
  }
  edit() {
    if (this.statusForm.valid) {
      let { name  } = this.statusForm.value;
      let  status = new Status_Process(name);
      this.processService
        .updatestatusP(this.data.status.id,status)
        .subscribe(() => this.onCloseDialog()
        );
        this.toastr.success('status edited',this.statusForm.get('name').value)
    }
  }
  onCloseDialog() {
    this.dialogRef.close();
  }

}
