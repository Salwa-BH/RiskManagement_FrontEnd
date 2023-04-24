import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProcessService } from "../../process.service";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { Subscription } from "rxjs";
import { ProcessTypesService } from '../../process-types/process-types.service';

@Component({
  selector: "app-processes-cartography",
  templateUrl: "./processes-cartography.component.html",
  styleUrls: ["./processes-cartography.component.css"],
})
export class ProcessesCartographyComponent implements OnInit, OnDestroy {
  processTypesSub: Subscription;
  processTypes: ProcessType[];

  constructor(
    private processTypeService: ProcessTypesService,
  ) {}

  ngOnInit() {
    this.processTypesSub = this.processTypeService
      .getProcessTypes()
      .subscribe((procTypes) => {
        this.processTypes = procTypes;
      });
  }

  ngOnDestroy() {
    this.processTypesSub.unsubscribe();
  }
}
