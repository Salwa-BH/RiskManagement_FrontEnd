import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Process } from "src/app/models/processes/Process.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProcessService } from "../../../../process.service";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { Subscription } from "rxjs";
import { ProcessTypesService } from "src/app/processes/process-types/process-types.service";

@Component({
  selector: "app-edit-process",
  templateUrl: "./edit-process.component.html",
  styleUrls: ["./edit-process.component.css"],
})
export class EditProcessComponent implements OnInit {
  selectedProcessType: number = 0;
  selectedParent: number = 0;
  processTypesSub: Subscription;
  processTypes: ProcessType[];

  processesSub: Subscription;
  processes: Process[];

  id: number;
  processForm: FormGroup;
  dataStorageSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private processTypeService: ProcessTypesService
  ) {
    if (this.data.editedProcess) {
      let process = this.data.editedProcess;
      this.selectedProcessType = process.process_type;
      this.selectedParent =
        process.parents.length > 0
          ? process.parents[process.parents.length - 1].id
          : 0;
    } else {
      this.selectedProcessType = 0;
      this.selectedParent = 0;
    }
  }

  ngOnInit() {
    this.processService.getProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data;
      })
    );

    this.processTypeService.getProcessTypes().subscribe((procTypes) => {
      this.processTypes = procTypes;
    });

    this.initForm();
  }

  private initForm() {
    let title: string = this.data.editedProcess.title;
    let description: string = this.data.editedProcess.description;
    let process_type: number = this.data.editedProcess.process_type;
    let parent: number = this.data.editedProcess.parent;

    this.processForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
      process_type: new FormControl(process_type, Validators.required),
      parent: new FormControl(parent, Validators.required),
    });
  }

  onEditProcess() {
    let {
      title,
      description,
      process_type,
      aim,
      parent,
      start_date,
      end_date,
    } = this.processForm.value;

    parent = +parent;
    process_type = +process_type;

    if (title.length > 0 && process_type != 0) {
      this.processService.editProcess(this.data.editedProcess.id, {
        title,
        description,
        aim,
        process_type,
        parent,
        start_date,
        end_date,
      });
      this.dialogRef.close();
    } else {
      alert("Veuillez remplir les champs requis!");
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close(this.processForm.value);
  }
}
