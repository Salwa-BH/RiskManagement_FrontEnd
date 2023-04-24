import { Component, OnInit } from "@angular/core";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { ProcessService } from "../../process.service";
import { MatDialog } from "@angular/material/dialog";
import {
  ActivatedRoute,
  Router,
  Params,
  RouterEvent,
  NavigationEnd,
} from "@angular/router";
import { Process } from "src/app/models/processes/Process.model";
import { ChangeElementStatusComponent } from "./change-element-status/change-element-status.component";
import { filter } from "rxjs/operators";
import { ProcessTypesService } from "../../process-types/process-types.service";
import { EditGenericProcessComponent } from "./edit-generic-process/edit-generic-process.component";
import { MergeProcessesComponent } from "./merge-processes/merge-processes.component";
import { Subscription } from "rxjs/internal/Subscription";
import { StateManagementService } from "src/app/shared/state-management.service";

@Component({
  selector: "app-generic-element-map",
  templateUrl: "./generic-element-map.component.html",
  styleUrls: ["./generic-element-map.component.css"],
})
export class GenericElementMapComponent implements OnInit {
  processes: any[];
  childrenCount: number[][];
  currentParentId: number;
  currentParent: Process;
  currentDepth: number;

  processTypes: ProcessType[] = [];
  procStateSub: any;

  companySiteSub: Subscription;

  lastLevel: Boolean ; //True if we are on the last level 

  constructor(
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    private stateManagementService: StateManagementService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.processes);
    
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
      });
    });
    this.companySiteSub = this.stateManagementService.companySiteSub.subscribe(
      (changed) => {
        this.refreshData();
      }
    );

    // Initiate the last Level 
  }

  onDestroy() {
    this.procStateSub.unsubscribe();
  }

  refreshData() {
    console.log(this.processes);
    if (+this.currentParentId === 0) {
      this.setRootProcessesAsContent();
    } else {
      this.setCustomProcessChildrenAsContent();
    }
  }

  setRootProcessesAsContent() {
    this.processService.getFormattedProcesses().then((sub) => {
      sub.subscribe((processes) => {
        this.currentParent = undefined;
        this.processes = [];
        /*
        Showing process if :
        1- Today's date is greater than/equal to the process's starting date
        2- Today's date is less than the process's ending date
        3- Ending date is null (no expiration date)
         */
        this.processes = processes.filter(
          (proc) =>
            new Date(proc.start_date) <= new Date() &&
            (proc.end_date === null
              ? true
              : new Date() < new Date(proc.end_date))
        );

        this.setChildrenCount();
      });
    });
  }

  setCustomProcessChildrenAsContent() {
    this.processService
      .getProcess(this.currentParentId)
      .subscribe((process) => {
        this.currentParent = process;
        this.processes = process.children;
        this.setChildrenCount();
      });
  }
  /*setCustomProcessChildrenAsContent() {
    this.processService
      .getProcess(this.currentParentId)
      .subscribe((process) => {
        if(process.children.length!=0)
        {
            this.currentParent = process;
            this.processes = process.children;
            this.setChildrenCount();
        }
      });
  }*/
  setChildrenCount() {
    // For every process, count number of children on each level
    // and store them on the childrenCount array
    this.processes.map((process, index) => {
      this.currentDepth = process.depth ? process.depth : 1;
      let count = [];
      let depthCounter = this.currentDepth;
      this.processService.getProcessChildrenCountByDepth(
        process,
        count,
        depthCounter
      );

      this.processes[index].childrenCount = count;this.childrenCount.length
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(EditGenericProcessComponent, {
      data: { parent: this.currentParent },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshData();
    });
  }

  onEdit(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      const dialogRef = this.dialog.open(EditGenericProcessComponent, {
        data: {
          parent: this.currentParent,
          editedProcess: process,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.refreshData();
      });
    });
  }

  onMerge(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      const dialogRef = this.dialog.open(MergeProcessesComponent, {
        width: "500px",
        data: { process },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.refreshData();
      });
    });
  }

  onChangeStatus(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      const dialogRef = this.dialog.open(ChangeElementStatusComponent, {
        data: {
          process,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        
        // we check if the status got changed
        if (result.isSuccess) {
          // we get a reference of the process instance that is showing on the component
          const originalProcess = this.getProcessFromProcessesList(
            process.id,
            this.processes
          );

          // we change its status with the new state
          originalProcess.status= result.newStatus;
          
        }
      });
    });
  }

  IsLastLevel(bool: Boolean){
    this.lastLevel=bool;
  }

  DecideLastLevel(processId){
    let maxType: number = 0;
    let process = this.processService.getProcess(processId);
    process.subscribe(x => { const type = x.process_type
        let typesTable: ProcessType[];
        this.processTypeService.getProcessTypes().subscribe( (types) => {
            typesTable = types,
            typesTable.forEach( function(value) {
              if(value.id > maxType) maxType = value.id;
          });
            this.processService.getProcess(processId).subscribe( x => {
                const depth = x.process_type
                //console.log( "depth " + depth + " maxtype " +maxType);
                if(depth < maxType-1){
                  this.IsLastLevel(false);
                } else {
                  this.IsLastLevel(true);
                }
            });
        }
        );
    });
  }
  onProcessChoice(processId) {
    let process = this.processService.getProcess(processId);
    process.subscribe(x => { const type = x.process_type 
      // if we are not in the last level, display the next level. But if we are, display nothing
      this.DecideLastLevel(processId);
      if(!this.lastLevel){
        this.currentParentId = processId;
        this.setCustomProcessChildrenAsContent();
      }
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
