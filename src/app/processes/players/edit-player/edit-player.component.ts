import { Component, OnInit, Inject } from "@angular/core";
import { PlayerService } from "../../players.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Player } from "src/app/models/processes/Player.model";
import { DatePipe } from '@angular/common';
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: "app-edit-player",
  templateUrl: "./edit-player.component.html",
  styleUrls: ["./edit-player.component.css"],
})
export class EditPlayerComponent implements OnInit {
  playerForm: FormGroup;
  names:string[] =[]// list containing short names and names of all data
  filteredShortNames: Observable<string[]>;
  filteredLongNames: Observable<string[]>;

  constructor(
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<EditPlayerComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data?.player) {
      this.playerForm = new FormGroup({
        short_name: new FormControl(
          data.player.short_name,
          Validators.required
        ),
        long_name: new FormControl(data.player.long_name),
        nature: new FormControl(data.player.nature),
        start_date: new FormControl(data.player.start_date),
        end_date: new FormControl(data.player.end_date),
      });
    } else {
      this.playerForm = new FormGroup({
        short_name: new FormControl("", Validators.required),
        long_name: new FormControl(""),
        nature: new FormControl(),
        start_date: new FormControl(new Date()),
        end_date: new FormControl(),
      });
    }
  }

  ngOnInit(): void {
    // make list containing all names
      this.playerService.getPlayers().subscribe(data => {
        data.forEach( p => {
          //if short_name does not exist on list 
          if(this.names.indexOf(p.short_name) < 0){
            this.names.push(p.short_name)
          }
          if(this.names.indexOf(p.long_name) < 0){
            this.names.push(p.long_name)
          }
        })
        this.filteredShortNames = this.playerForm.get("short_name").valueChanges
        .pipe(
          startWith(""),
          map((value) => this.filterPlayers(value))
        );
        
        this.filteredLongNames = this.playerForm.get("long_name").valueChanges
        .pipe(
          startWith(""),
          map((value) => this.filterPlayers(value))
        );
      })
  }
  private filterPlayers(value: any): string[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }
    if (this.names && value && typeof value !== "number") {
      const filterValue = value.toLowerCase();

      return this.names.filter((product) =>
        product.toLowerCase().includes(filterValue)
      );
    }

    return this.names;
  }

  displayFn(io: string): string {
    return  io && io ? io : "";
  }


  formatDate(date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  createPlayer() {
    if (this.playerForm.valid) {
      let long_name=this.playerForm.get('long_name').value;
   
      
      if(long_name===""){
        long_name=this.playerForm.get('short_name').value;
      }
      const {
        short_name,
        start_date,
        end_date,
        nature,
      } = this.playerForm.value;
      const player = new Player(
        short_name,
        long_name,
        nature,
        this.formatDate(start_date),
        this.formatDate(end_date)
      );
      this.playerService.createPlayer(player);
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }
  }

  editPlayer() {
    if (this.playerForm.valid) {
      let long_name=this.playerForm.get('long_name').value;
      if(long_name===""){
        long_name=this.playerForm.get('short_name').value;
      }
      const {
        short_name,
        nature,
        start_date,
        end_date,
      } = this.playerForm.value;

      const player = new Player(
        short_name,
        long_name,
        nature,
        this.formatDate(start_date),
        this.formatDate(end_date)
      );
      this.playerService.editPlayer(this.data?.playerId, player);
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
