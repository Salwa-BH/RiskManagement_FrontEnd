import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { Process } from "src/app/models/processes/Process.model";
import { ProcessService } from "src/app/processes/process.service";
import { ProcessTypesService } from "src/app/processes/process-types/process-types.service";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { startWith, map } from "rxjs/operators";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-edit-generic-process",
  templateUrl: "./edit-generic-process.component.html",
  styleUrls: ["./edit-generic-process.component.css"],
})
export class EditGenericProcessComponent implements OnInit {
  processTypes: ProcessType[];
  processes: Process[];
  parentProcess: Process = undefined;

  processForm: FormGroup;

  filteredParents: Observable<Process[]>;
  selectedProcessType: number;

  constructor(
    public dialogRef: MatDialogRef<EditGenericProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    private datePipe: DatePipe
  ) {
    let editedProcess = this.data.editedProcess;
    //  If we are editing a process, fill the form with its data
    if (editedProcess) {
      const {
        title,
        description,
        process_type,
        aim,
        start_date,
        end_date,
      } = editedProcess;

      //  checking if it has a parent first
      if (editedProcess.parents.length > 0) {
        this.parentProcess =
          editedProcess.parents[editedProcess.parents?.length - 1];
      }

      this.processForm = new FormGroup({
        title: new FormControl(title, Validators.required),
        description: new FormControl(description),
        aim: new FormControl(aim),
        process_type: new FormControl(process_type, Validators.required),
        parent: new FormControl(null),
        start_date: new FormControl(start_date, Validators.required),
        end_date: new FormControl(end_date),
      });
    } else {
      // If we are creating a new process, create an empty form
      this.processForm = new FormGroup({
        title: new FormControl("", Validators.required),
        description: new FormControl(""),
        aim: new FormControl(""),
        process_type: new FormControl(0, Validators.required),
        parent: new FormControl(),
        start_date: new FormControl(new Date(), Validators.required),
        end_date: new FormControl(null),
      });
    }
  }

  ngOnInit() {
    this.processService.getProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data;
        // this.processes.map((process) =>
        //   console.log(new Date(process.start_date) <= new Date())
        // );
        this.processForm.get("parent").setValue(this.data.parent);
        this.filteredParents = this.processForm.get("parent").valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
      })
    );

    this.processTypeService.getProcessTypes().subscribe((procTypes) => {
      this.processTypes = procTypes;

      let parent = this.data.parent;

      if (parent) {
        let processType = this.processTypes.find(
          (type) => type.id === parent.process_type
        ).children[0];

        this.processForm.get("process_type").setValue(processType.id);
        this.processForm.get("parent").setValue(parent.id);
      } else {
        // If we want to create a new process at the root level

        // Get the root process type
        let processType = this.processTypes.find((type) => type.depth === 1);

        this.processForm.get("process_type").setValue(processType.id);
        this.processForm.get("parent").setValue(0);
      }
    });
  }

  displayFn(process: Process): string {
    return process && process.title ? process.title : "";
  }

  private _filter(value: any): Process[] {
    if (typeof value === "number" && value === 0) {
      return [new Process("No parent - Root process", "", "", 0, 0, "", "")];
    }

    if (this.processes && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.title.toLowerCase();
      return this.processes.filter((process) =>
        process.title.toLowerCase().includes(filterValue)
      );
    }

    return this.processes;
  }

  transformToSqlDate(date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  onCreateProcess() {
    let {
      title,
      description,
      aim,
      process_type,
      parent,
      start_date,
      end_date,
    } = this.processForm.value;

    if (typeof parent === "undefined" || typeof parent !== "object") parent = 0;
    else parent = parent.id;

    let startDate = new Date(start_date);
    let endDate = new Date(end_date);

    if (startDate <= endDate || end_date === null) {
      if (title.length > 0 && process_type != 0) {
        this.processService
          .addProcess(
            title,
            description,
            aim,
            +process_type,
            parent,
            this.transformToSqlDate(start_date),
            this.transformToSqlDate(end_date)
          )
          .then((result) => {
            // If this is the first child, change status fom empty to in progress automatically:
            console.log(parent);
            let parent_process=this.processes.find(p => p.id == parent);
            if( parent_process.status == "Empty"){
              this.processService.changeProcessStatus(parent_process.id,"In progress").subscribe();
            }
            result.subscribe(() => this.onCloseDialog());
          });
      } else {
        alert("Please fill all the required fields");
      }
    } else {
      alert("Ending date must be greater or equal to starting date");
    }
  }

  onEditProcess() {
    let {
      title,
      description,
      aim,
      process_type,
      parent,
      start_date,
      end_date,
    } = this.processForm.value;

    if (typeof parent === "undefined" || typeof parent !== "object") parent = 0;
    else parent = parent.id;

    let startDate = new Date(start_date);
    let endDate = new Date(end_date);

    process_type = +process_type
    
    if (startDate <= endDate || end_date === null) {
      if (title.length > 0 && process_type != 0) {
        this.processService
          .editProcess(
            this.data.editedProcess.id,
            {title,
            description,
            aim,
            process_type,
            parent,
            start_date: this.transformToSqlDate(start_date),
            end_date: this.transformToSqlDate(end_date)}
          )
          .then((result) => {
            result.subscribe(() => this.onCloseDialog());
          });
      } else {
        alert("Veuillez remplir les champs requis!");
      }
    } else {
      alert("Ending date must be greater or equal to starting date");
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
