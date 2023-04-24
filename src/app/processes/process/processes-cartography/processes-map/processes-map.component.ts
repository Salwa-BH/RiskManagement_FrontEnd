import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Process } from "src/app/models/processes/Process.model";
import { ProcessService } from "../../../process.service";
import { StateManagementService } from "src/app/shared/state-management.service";

@Component({
  selector: "app-processes-map",
  templateUrl: "./processes-map.component.html",
  styleUrls: ["./processes-map.component.css"],
})
export class ProcessesMapComponent implements OnInit, OnDestroy {
  companySiteSub: Subscription;
  procStateSub: Subscription;

  processes: Process[];

  constructor(
    private processService: ProcessService,
    private stateManagementService: StateManagementService
  ) {}

  ngOnInit() {
    this.init();

    this.companySiteSub = this.stateManagementService.companySiteSub.subscribe(
      (changed) => this.init()
    );

    this.procStateSub = this.processService.processesTreeChanged.subscribe(
      (data) => {
        this.processes = data;
      }
    );
  }

  private init() {
    this.processService.getFormattedProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data;
      })
    );
  }

  ngOnDestroy() {
    this.companySiteSub.unsubscribe();
    this.procStateSub.unsubscribe();
  }
}

