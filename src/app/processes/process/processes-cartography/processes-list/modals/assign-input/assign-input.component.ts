import { Component, OnInit, Inject } from "@angular/core";
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { ProcessService } from "src/app/processes/process.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessIo } from "src/app/models/processes/ProcessIo.model";
import { IoElement } from "src/app/models/processes/IoElement.model";
import { IoService } from "src/app/processes/io.service";

@Component({
  selector: "app-assign-input",
  templateUrl: "./assign-input.component.html",
  styleUrls: ["./assign-input.component.css"],
})
export class AssignInputComponent implements OnInit {
  inputs: ProcessIo[];

  currentInputsIds: number[];
  availableIOs: IoElement[];

  constructor(
    public dialogRef: MatDialogRef<AssignInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private ioService: IoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.inputs = [];
    this.currentInputsIds = [];
    this.availableIOs = [];

    // Getting and setting the current process Inputs
    this.processService
      .getProcessIOs(this.data?.processId)
      .subscribe((data) => {
        this.inputs = data.filter((input) => input.io_type === "Input");

        this.currentInputsIds = [];

        this.inputs?.map((processInput) => {
          this.currentInputsIds.push(processInput.io_element);
        });

        this.filterIOs();
      });

    //  Getting all the inputs
    this.ioService.getIoElements().subscribe((data) => {
      this.availableIOs = data;
      this.filterIOs();
    });
  }
  /*
   * This function allows us to filter players that aren't suppliers
   * of the current selected process, so that in the players list, we will show only these
   * players in order to be able to assign them as suppliers,
   * Hint : add it to every subscription you create, since you don't know
   * which subscription will resolve first
   */
  filterIOs() {
    let filteredData = this.availableIOs?.slice() ?? [];

    this.availableIOs = filteredData.filter(
      (io) => !this.currentInputsIds?.includes(io.id)
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.id === "inputsList") {
        this.processService
          .setProcessIo(
            this.data.processId,
            +event.item.element.nativeElement.id,
            "Input"
          )
          .subscribe((data) => this.getData());
      } else if (event.container.id === "iosList") {
        this.processService
          .deleteProcessIo(+event.item.element.nativeElement.id)
          .subscribe((data) => this.getData());
      }
    }
  }
}
