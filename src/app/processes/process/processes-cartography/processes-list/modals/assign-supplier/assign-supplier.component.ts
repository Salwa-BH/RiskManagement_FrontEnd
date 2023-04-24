import { Component, OnInit, Inject, SimpleChanges } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessService } from "src/app/processes/process.service";
import { ProcessPlayer } from "src/app/models/processes/ProcessPlayer.model";
import { Player } from "src/app/models/processes/Player.model";
import { PlayerService } from "src/app/processes/players.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-assign-supplier",
  templateUrl: "./assign-supplier.component.html",
  styleUrls: ["./assign-supplier.component.css"],
})
export class AssignSupplierComponent implements OnInit {
  suppliers: ProcessPlayer[];

  currentSuppliersIds: number[];
  availablePlayers: Player[];

  constructor(
    public dialogRef: MatDialogRef<AssignSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.suppliers = [];
    this.currentSuppliersIds = [];
    this.availablePlayers = [];

    // Getting and setting the current process players
    this.processService
      .getProcessPlayers(this.data?.processId)
      .subscribe((data) => {
        this.suppliers = data.filter(
          (player) => player.playerRole === "Supplier"
        );

        this.currentSuppliersIds = [];

        this.suppliers?.map((procPlayer) => {
          this.currentSuppliersIds.push(procPlayer.player);
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
      (player) => !this.currentSuppliersIds?.includes(player.id)
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
      if (event.container.id === "suppliersList") {
        this.processService
          .setProcessPlayer(
            this.data.processId,
            +event.item.element.nativeElement.id,
            "Supplier"
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
