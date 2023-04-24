import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ProcessService } from "../../../process.service";
import { Process } from "src/app/models/processes/Process.model";
import { MatDialog } from "@angular/material/dialog";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { DeleteProcessComponent } from "./delete-process/delete-process.component";
import { EditProcessComponent } from "./edit-process/edit-process.component";
import { Router } from "@angular/router";
import { CreateProcessComponent } from "./create-process/create-process.component";
import { MergeProcessesComponent } from "../../generic-element-map/merge-processes/merge-processes.component";
import { ContextMenuComponent } from "ngx-contextmenu";
import { AssignCustomerComponent } from "./modals/assign-customer/assign-customer.component";
import { AssignSupplierComponent } from "./modals/assign-supplier/assign-supplier.component";
import { AssignInputComponent } from "./modals/assign-input/assign-input.component";
import { AssignOutputComponent } from "./modals/assign-output/assign-output.component";
import { AssignPilotComponent } from "./modals/assign-pilot/assign-pilot/assign-pilot.component";
import { StateManagementService } from "src/app/shared/state-management.service";
import { ProcessTypesService } from 'src/app/processes/process-types/process-types.service';

@Component({
  selector: "app-processes-list",
  templateUrl: "./processes-list.component.html",
  styleUrls: ["./processes-list.component.css"],
})
export class ProcessesListComponent implements OnInit, OnDestroy {
  @ViewChild(ContextMenuComponent) public crudMenu: ContextMenuComponent;

  companySiteSub: Subscription;
  procStateSub: Subscription;

  public processes: Process[];
  processTypes: ProcessType[];

  constructor(
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    public dialog: MatDialog,
    private stateManagementService: StateManagementService
  ) {}

  ngOnInit() {
    this.init();

    this.companySiteSub = this.stateManagementService.companySiteSub.subscribe(
      (changed) => {
        this.init();
      }
    );

    this.procStateSub = this.processService.processesTreeChanged.subscribe(
      (processes) => {
        this.processes = processes;
      }
    );
  }

  ngOnDestroy() {
    this.companySiteSub?.unsubscribe();
    this.procStateSub.unsubscribe();
  }

  private init() {
    this.processService.getFormattedProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data;
      })
    );

    this.processTypeService.getProcessTypes().subscribe((procTypes) => {
      this.processTypes = procTypes;
    });
  }

  openCreateProcess(event) {
    let processId = event.item.id;
    this.processService.getProcess(+processId).subscribe((data) => {
      this.dialog.open(CreateProcessComponent, {
        width: "300px",
        data: {
          processes: this.processes,
          procTypes: this.processTypes,
          parentProcess: data,
        },
      });
    });
  }

  openProcessMergeDialog() {
    this.dialog.open(MergeProcessesComponent, {
      width: "500px",
    });
  }

  openProcessCreationDialog() {
    const dialogRef = this.dialog.open(CreateProcessComponent, {
      width: "300px",
      data: { processes: this.processes },
    });
  }

  openProcessEdit(event) {
    let processId = event.item.id;
    this.processService.getProcess(+processId).subscribe((process) =>
      this.dialog.open(EditProcessComponent, {
        width: "300px",
        data: { editedProcess: process },
      })
    );
  }

  onDeleteProcess(event) {
    let processId = event.item.id;
    this.processService.getProcess(+processId).subscribe((process) =>
      this.dialog.open(DeleteProcessComponent, {
        width: "300px",
        data: { deletedProcess: process },
      })
    );
  }

  onAssignSupplier(event) {
    this.dialog.open(AssignSupplierComponent, {
      width: "1000px",
      height: "800px",
      data: { processId: event.item.id },
    });
  }

  onAssignCustomer(event) {
    this.dialog.open(AssignCustomerComponent, {
      width: "1000px",
      height: "800px",
      data: { processId: event.item.id },
    });
  }

  onAssignInput(event) {
    this.dialog.open(AssignInputComponent, {
      width: "1000px",
      height: "800px",
      data: { processId: event.item.id },
    });
  }

  onAssignOutput(event) {
    this.dialog.open(AssignOutputComponent, {
      width: "1000px",
      height: "800px",
      data: { processId: event.item.id },
    });
  }

  onAssignPilot(event) {
    this.dialog.open(AssignPilotComponent, {
      width: "450px",
      height: "250px",
      data: { processId: event.item.id },
    });
  }
}
