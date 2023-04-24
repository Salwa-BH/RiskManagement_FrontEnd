import { Component, OnInit, Inject } from "@angular/core";
import { Player } from "src/app/models/processes/Player.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProcessService } from "src/app/processes/process.service";
import { PlayerService } from "src/app/processes/players.service";
import { ProcessPlayer } from "src/app/models/processes/ProcessPlayer.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-assign-customer",
  templateUrl: "./assign-customer.component.html",
  styleUrls: ["./assign-customer.component.css"],
})
export class AssignCustomerComponent implements OnInit {
  customers: ProcessPlayer[];

  currentCustomersIds: number[];
  availablePlayers: Player[];

  constructor(
    public dialogRef: MatDialogRef<AssignCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.customers = [];
    this.currentCustomersIds = [];
    this.availablePlayers = [];

    // Getting and setting the current process players
    this.processService
      .getProcessPlayers(this.data?.processId)
      .subscribe((data) => {
        this.customers = data.filter(
          (player) => player.playerRole === "Customer"
        );

        this.currentCustomersIds = [];

        this.customers?.map((procPlayer) => {
          this.currentCustomersIds.push(procPlayer.player);
        });

        this.filterPlayers();
      });

    //  Getting all the players
    this.playerService.getPlayers().subscribe((data) => {
      this.availablePlayers = data;
      this.filterPlayers();
    });
  }
  /*
   * This function allows us to filter players that aren't suppliers
   * of the current selected process, so that in the players list, we will show only these
   * players in order to be able to assign them as suppliers,
   * Hint : add it to every subscription you create, since you don't know
   * which subscription will resolve first
   */
  filterPlayers() {
    let filteredData = this.availablePlayers?.slice() ?? [];

    this.availablePlayers = filteredData.filter(
      (player) => !this.currentCustomersIds?.includes(player.id)
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
      if (event.container.id === "customersList") {
        this.processService
          .setProcessPlayer(
            this.data.processId,
            +event.item.element.nativeElement.id,
            "Customer"
          )
          .subscribe((data) => this.getData());
      } else if (event.container.id === "playersList") {
        this.processService
          .deleteProcessPlayer(+event.item.element.nativeElement.id)
          .subscribe((data) => this.getData());
      }
    }
  }
}
