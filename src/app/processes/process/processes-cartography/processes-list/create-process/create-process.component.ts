import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Process } from "src/app/models/processes/Process.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProcessService } from "../../../../process.service";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { Subscription, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ProcessTypesService } from "src/app/processes/process-types/process-types.service";

@Component({
  selector: "app-create-process",
  templateUrl: "./create-process.component.html",
  styleUrls: ["./create-process.component.css"],
})
export class CreateProcessComponent implements OnInit {
  title: string = "";
  description: string = "";
  process_type: number;
  parent: number;

  processTypes: ProcessType[];
  processes: Process[];

  processForm: FormGroup;

  filteredOptions: Observable<Process[]>;
  selectedProcessType: number;

  constructor(
    public dialogRef: MatDialogRef<CreateProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private processTypeService: ProcessTypesService
  ) {
    if (this.data.procTypes) {
      this.processes = this.data.processes;
      this.processTypes = this.data.procTypes;
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
    if (this.data.parentProcess) {
      let parentProcess = this.data.parentProcess;

      let parent: number = parentProcess ? parentProcess.id : 0;

      let parentType = this.processTypes.find(
        (type) => type.id === parentProcess.process_type
      );
      this.selectedProcessType =
        parentType.children.length > 0 ? parentType.children[0].id : 0;

      this.processForm = new FormGroup({
        title: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        process_type: new FormControl(
          this.selectedProcessType,
          Validators.required
        ),
        parent: new FormControl(parent, Validators.required),
      });
    } else {
      this.processForm = new FormGroup({
        title: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        process_type: new FormControl(0, Validators.required),
        parent: new FormControl(0, Validators.required),
      });
    }
  }

  onCreateProcess() {
    const {
      title,
      description,
      aim,
      process_type,
      parent,
      start_date,
      end_date,
    } = this.processForm.value;
    if (title.length > 0 && process_type != 0) {
      this.processService.addProcess(
        title,
        description,
        aim,
        +process_type,
        +parent,
        start_date,
        end_date
      );
      this.dialogRef.close();
    } else {
      alert("Veuillez remplir les champs requis!");
    }
  }

  onCloseDialog(): void {
    console.log(this.processForm.value);
    this.dialogRef.close(this.processForm.value);
  }
}
