import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ProcessService } from "../../../process.service";
import { Process } from "src/app/models/processes/Process.model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { map } from "rxjs/operators";

@Component({
  selector: "app-merge-processes",
  templateUrl: "./merge-processes.component.html",
  styleUrls: ["./merge-processes.component.css"],
})
export class MergeProcessesComponent implements OnInit, OnDestroy {
  processes: Process[];
  processSub: Subscription;

  newProcessCreation: boolean = false;
  filteredProcesses: Observable<Process[]>;

  processMergeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MergeProcessesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService
  ) {
    this.processMergeForm = new FormGroup({
      secondProcess: new FormControl(null, Validators.required),
      processName: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.processService.getProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data.filter(
          (process) => process.id !== this.data.processId
        );
      })
    );
  }

  ngOnDestroy() {}

  onProcessMerge() {
    console.log(this.processMergeForm.value);
    if (this.processMergeForm.valid) {
      let newProcName = this.processMergeForm.value.processName;

      const firstProc = this.data.process;

      const secondProc = this.processes.find(
        (proc) => proc.id === this.processMergeForm.value.secondProcess
      );

      if (firstProc?.process_type === secondProc?.process_type) {
        newProcName =
          newProcName === "1" || newProcName === "2"
            ? newProcName === "1"
              ? firstProc.title
              : secondProc.title
            : newProcName;

        this.processService
          .mergeProcesses(firstProc.id, secondProc.id, newProcName)
          .subscribe(() => {
            this.onCloseDialog();
          });
      } else {
        alert("The chosen process must be of the same type");
      }
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close(this.processMergeForm.value);
  }

  switchCreationState(state) {
    console.log(state);
    this.newProcessCreation = state;
    if (state === true) {
      this.processMergeForm.get("processName").setValue("");
    }
  }
}
