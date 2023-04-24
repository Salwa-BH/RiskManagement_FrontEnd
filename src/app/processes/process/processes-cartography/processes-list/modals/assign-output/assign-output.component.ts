import { Component, OnInit, Inject } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ProcessIo } from 'src/app/models/processes/ProcessIo.model';
import { IoElement } from 'src/app/models/processes/IoElement.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProcessService } from 'src/app/processes/process.service';
import { IoService } from 'src/app/processes/io.service';

@Component({
  selector: 'app-assign-output',
  templateUrl: './assign-output.component.html',
  styleUrls: ['./assign-output.component.css']
})
export class AssignOutputComponent implements OnInit {

  outputs: ProcessIo[];

  currentOutputsIds: number[];
  availableIOs: IoElement[];

  constructor(
    public dialogRef: MatDialogRef<AssignOutputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private ioService: IoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.outputs = [];
    this.currentOutputsIds = [];
    this.availableIOs = [];

    // Getting and setting the current process Outputs
    this.processService
      .getProcessIOs(this.data?.processId)
      .subscribe((data) => {
        this.outputs = data.filter(
          (input) => input.io_type === "Output"
        );

        this.currentOutputsIds = [];

        this.outputs?.map((processInput) => {
          this.currentOutputsIds.push(processInput.io_element);
        });

        this.filterIOs();
      });

    //  Getting all the outputs
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
      (io) => !this.currentOutputsIds?.includes(io.id)
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
      if (event.container.id === "outputsList") {
        this.processService
          .setProcessIo(
            this.data.processId,
            +event.item.element.nativeElement.id,
            "Output"
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
