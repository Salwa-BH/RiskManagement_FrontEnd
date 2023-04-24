import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProcessService } from "../../process.service";
import { Subscription } from "rxjs";
import { Process } from "src/app/models/processes/Process.model";
import { ProcessPlayer } from "src/app/models/processes/ProcessPlayer.model";
import { ProcessIo } from "src/app/models/processes/ProcessIo.model";
import { ActivatedRoute, Params } from "@angular/router";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { ProcessTypesService } from "../../process-types/process-types.service";
import { EditSipocComponent } from "../generic-sipoc/edit-sipoc/edit-sipoc.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-processes-identity",
  templateUrl: "./processes-identity.component.html",
  styleUrls: ["./processes-identity.component.css"],
})
export class ProcessesIdentityComponent implements OnInit, OnDestroy {
  children: any[];
  suppliers: ProcessPlayer[];
  customers: ProcessPlayer[];
  inputs: ProcessIo[];
  outputs: ProcessIo[];

  public selectedProcess: Process;

  processTypes: ProcessType[];

  procStateSub: Subscription;
  companySiteSub: Subscription;

  constructor(
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.processService.getProcess(+params.id).subscribe((process) => {
          this.selectedProcess = process;
          this.init(process.id);
        });
      }
    });

    this.processTypeService.getProcessTypes().subscribe((data) => {
      this.processTypes = data;
    });
  }

  ngOnDestroy() {
    // this.procStateSub.unsubscribe();
  }

  init(processID: number) {
    this.processService.getFormattedProcessChildren(processID).subscribe(
      (data) => {
        if (data.length !== 0) {
          let result = [];
          this.formatChildProcesses(data, result);
          this.children = result[0]?.children;
          this.sortProcessesArray();
          this.onProcessChange();
        }
      },
      (err) => alert("Une erreur est survenue !")
    );
  }

  formatChildProcesses(data, result) {
    data.map((process, index) => {
      result.push({
        id: process.id,
        ...process.data,
        children: [],
      });

      if (process && process.children) {
        {
          this.formatChildProcesses(process.children, result[index].children);
        }
      }
    });
  }

  private sortProcessesArray() {
    this.children.sort((a, b) => a.id - b.id);
  }

  onProcessChange() {
    this.children.map((child) => {
      this.setProcessPlayers(child);
      this.setProcessIOs(child);
    });
  }

  setProcessPlayers(process: Process) {
    this.processService.getProcessPlayers(process.id).subscribe(
      (data) => {
        process.customers = data.filter(
          (player) => player.playerRole === "Customer"
        );
        process.suppliers = data.filter(
          (player) => player.playerRole === "Supplier"
        );

        process?.children?.map((child) => {
          this.setProcessPlayers(child);
        });
      },
      (err) => {
        process.customers = [];
        process.suppliers = [];
        alert("Une erreur est survenue !");
      }
    );
  }

  setProcessIOs(process: Process) {
    this.processService.getProcessIOs(process.id).subscribe(
      (data) => {
        process.inputs = data.filter((io) => io.io_type === "Input");
        process.outputs = data.filter((io) => io.io_type === "Output");

        process?.children?.map((child) => {
          this.setProcessIOs(child);
        });
      },
      (err) => {
        process.inputs = [];
        process.outputs = [];
        alert("Une erreur est survenue !");
      }
    );
  }

  getProcessTypeName(processTypeId: number) {
    let type = this.processTypes.filter((type) => type.id === processTypeId);
    return type[0].name ? type[0].name : "";
  }

  isLeaf(process) {
    if (process.children.length === 0) {
      return true;
    }

    return false;
  }

  openSipocEditionDialog(processId) {
    this.processService.getProcess(processId).subscribe((process) => {
      const dialogRef = this.dialog.open(EditSipocComponent, {
        width: "600px",
        data: { process },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.onProcessChange();
      });
    });
  }
}
