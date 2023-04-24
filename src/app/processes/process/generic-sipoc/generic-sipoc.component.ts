import { Component, OnInit } from "@angular/core";
import {
  RouterEvent,
  NavigationEnd,
  ActivatedRoute,
  Router,
  Params,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { Process } from "src/app/models/processes/Process.model";
import { MatDialog } from "@angular/material/dialog";
import { ProcessService } from "../../process.service";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { ChangeElementStatusComponent } from "../generic-element-map/change-element-status/change-element-status.component";
import { CreateProcessComponent } from "../processes-cartography/processes-list/create-process/create-process.component";
import { RenameElementComponent } from "../generic-element-map/rename-element/rename-element.component";
import { empty, Subscription } from "rxjs";
import { ProcessTypesService } from "../../process-types/process-types.service";
import { EditSipocComponent } from "./edit-sipoc/edit-sipoc.component";
import { StateManagementService } from "src/app/shared/state-management.service";

@Component({
  selector: "app-generic-sipoc",
  templateUrl: "./generic-sipoc.component.html",
  styleUrls: ["./generic-sipoc.component.css"],
})
export class GenericSipocComponent implements OnInit {
  processes: any[];
  childrenCount: number[][];
  currentParentId: number;
  currentParent: Process;
  procStateSub: any;

  processTypes: ProcessType[] = [];
  defaultType: ProcessType;

  companySiteSub: Subscription;

  constructor(
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    private stateManagementService: StateManagementService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companySiteSub = this.stateManagementService.companySiteSub.subscribe(
      (changed) => {
        this.refreshData();
      }
    );

    /*
     * This allows to listen to listen to router events, since we can't refresh
     * the component if a routerLink points to the same route with the same params
     * The router always emits events (we configured the router module to send events even if we redirect to the same route)
     */
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        let id = +this.activatedRoute.snapshot.params.id;

        this.currentParentId = id === null || Number.isNaN(id) ? 0 : id;

        if (+this.currentParentId === 0) {
          this.setRootProcessesAsContent();
        } else {
          this.setCustomProcessChildrenAsContent();
        }
      });

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      let id = +params.get("id");
      this.currentParentId = id === null || Number.isNaN(id) ? 0 : id;

      if (+this.currentParentId === 0) {
        this.setRootProcessesAsContent();
      } else {
        this.setCustomProcessChildrenAsContent();
      }
    });

    this.processTypeService.getProcessTypes().subscribe((processTypes) => {
      processTypes.map((type) => {
        this.processTypes[type.depth] = type;

        // set the default process type
        type.is_default ? (this.defaultType = type) : empty;
      });
    });
  }

  refreshData() {
    if (+this.currentParentId === 0) {
      this.setRootProcessesAsContent();
    } else {
      this.setCustomProcessChildrenAsContent();
    }
  }

  onProcessChoice(processId) {
    this.currentParentId = processId;
    this.processService.getProcess(processId).subscribe((process) => {
      if (process.process_type === this.defaultType.id) {
        this.router.navigate(["/processes", "identity", process.id]);
      } else {
        this.setCustomProcessChildrenAsContent();
      }
    });
  }

  setRootProcessesAsContent() {
    this.processService.getFormattedProcesses().then((sub) => {
      sub.subscribe((processes) => {
        this.currentParent = undefined;
        this.processes = [];
        this.processes = processes;
        this.setCompleteChildrenCount();
      });
    });
  }

  setCustomProcessChildrenAsContent() {
    this.processService
      .getProcess(this.currentParentId)
      .subscribe((process) => {
        this.currentParent = process;
        this.processes = process.children;
        this.setCompleteChildrenCount();
      });
  }

  setCompleteChildrenCount() {
    this.processes.map((process) => {
      if (process.children) {
        let completeChildCounter = 0;

        process.children.map((child) =>
          child.status === "complete" ? completeChildCounter++ : empty
        );

        process.completeChildCount = completeChildCounter;
      } else {
        process.completeChildCount = 0;
      }
    });
  }

  openSipocCreationDialog() {
    const dialogRef = this.dialog.open(EditSipocComponent, {
      width: "600px",
      data: { processes: this.processes },
    });
  }

  onRename(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      let dialogRef = this.dialog.open(RenameElementComponent, {
        data: {
          process,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // we check if the title got changed
        if (result.isSuccess) {
          // we get a reference of the process instance that is showing on the component
          let originalProcess = this.getProcessFromProcessesList(
            process.id,
            this.processes
          );

          // we change its title with the new title value
          originalProcess.title = result.newTitle;
        }
      });
    });
  }

  onChangeStatus(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      let dialogRef = this.dialog.open(ChangeElementStatusComponent, {
        data: {
          process,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // we check if the status got changed
        if (result.isSuccess) {
          // we get a reference of the process instance that is showing on the component
          let originalProcess = this.getProcessFromProcessesList(
            process.id,
            this.processes
          );

          // we change its status with the new state
          originalProcess.status = result.newStatus;
        }
      });
    });
  }

  getProcessFromProcessesList(processId: number, processes: Process[]) {
    if (processes?.length > 0) {
      let process = processes.find((process) => process.id === processId);
      if (process) return process;
      else
        processes.map((process) =>
          process.children?.map((child) => {
            if (child.id === processId) return child;
            else {
              if (child.children)
                this.getProcessFromProcessesList(processId, child.children);
            }
          })
        );
    }
  }
}
