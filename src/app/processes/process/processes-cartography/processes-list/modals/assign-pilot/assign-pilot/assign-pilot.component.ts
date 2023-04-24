import { Component, OnInit, Inject } from "@angular/core";
import { ProcessPlayer } from "src/app/models/processes/ProcessPlayer.model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessService } from "src/app/processes/process.service";
import { PlayerService } from "src/app/processes/players.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Player } from "src/app/models/processes/Player.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Process } from "src/app/models/processes/Process.model";

@Component({
  selector: "app-assign-pilot",
  templateUrl: "./assign-pilot.component.html",
  styleUrls: ["./assign-pilot.component.css"],
})
export class AssignPilotComponent implements OnInit {
  players: Player[];
  currentPilot: ProcessPlayer;
  selectedProcess: Process;

  pilotForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AssignPilotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.pilotForm = new FormGroup({
      selectedPilot: new FormControl(null, Validators.required),
    });

    this.getData();
  }

  private getData() {
    this.players = [];

    // Getting the selected process data
    this.processService.getProcess(this.data?.processId).subscribe((data) => {
      this.selectedProcess = data;
    });

    // Getting the current pilot of the selected process
    this.processService
      .getProcessPlayers(this.data?.processId)
      .subscribe((data) => {
        this.currentPilot = data.find(
          (player) => player.playerRole === "Pilot"
        );
        console.log(this.currentPilot)
      });

    //  Getting all the players for the form's select list
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
    });
  }

  onConfirmation() {
    /*
     * If a process already have a pilot assigned, we delete it first
     * since a process pilot is unique then we assign the newest pilot
     */
    console.log("pilot")
    console.log(this.currentPilot)

    if (this.currentPilot !== undefined) {
      this.processService
        .deleteProcessPlayer(+this.currentPilot.id)
        .subscribe((data) =>
          this.processService
            .setProcessPlayer(
              this.data.processId,
              +this.pilotForm.value.selectedPilot,
              "Pilot"
            )
            .subscribe((data) => this.onCloseDialog())
        );
    } else {
      /*
       * If the process still doesn't have a pilot, we assign the pilot directly
       */
      this.processService
        .setProcessPlayer(
          this.data.processId,
          +this.pilotForm.value.selectedPilot,
          "Pilot"
        )
        .subscribe((data) => this.onCloseDialog());
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
