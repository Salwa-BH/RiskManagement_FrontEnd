import { Component, OnInit, Inject } from "@angular/core";
import { PlayerService } from "../../players.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-player",
  templateUrl: "./delete-player.component.html",
  styleUrls: ["./delete-player.component.css"],
})
export class DeletePlayerComponent implements OnInit {
  constructor(
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<DeletePlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirmDeletion() {
    this.playerService.deletePlayer(this.data?.playerId);
    this.onCloseDialog();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
