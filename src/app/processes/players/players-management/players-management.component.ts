import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlayerService } from "../../players.service";
import { Player } from "src/app/models/processes/Player.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EditPlayerComponent } from "../edit-player/edit-player.component";
import { MatDialog } from "@angular/material/dialog";
import { DeletePlayerComponent } from "../delete-player/delete-player.component";
//import {ExportService } from "src/app/shared/export.service";

@Component({
  selector: "app-players-management",
  templateUrl: "./players-management.component.html",
  styleUrls: ["./players-management.component.css"],
})
export class PlayersManagementComponent implements OnInit, OnDestroy {
  players: Player[];
  p=1;
  pageSize = 10;
  pageSizes = [10, 20,50];
  a: { table: { widths: string[]; body: any[]; }; };
  playersSub: Subscription;

  constructor(private playerService: PlayerService, 
    public dialog: MatDialog,
    //public exportService:ExportService,
    ) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((data) => (this.players = data));

    this.playersSub = this.playerService.playersChanged.subscribe(
      (data) => (this.players = data)
    );
  }
  handlePageChange(event) {
    this.p = event;

  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.p = 1;
  }
  ngOnDestroy() {
    this.playersSub.unsubscribe();
  }

  edit(event) {
    this.playerService.getPlayer(event.target.id).subscribe((player) => {
      const dialogRef = this.dialog.open(EditPlayerComponent, {
        width: "350px",
        data: { player, playerId: +event.target.id },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    });
  }

  delete(event) {
    this.playerService.getPlayer(event.target.id).subscribe((player) => {
      this.dialog.open(DeletePlayerComponent, {
        width: "350px",
        data: { player, playerId: +event.target.id },
      });
    });
  }
  exportexcel(players){
    //this.exportService.exportexcel(players);
  }
  exportcsv(players){ 
    //this.exportService.exportcsv(players);
   }
  generatePdf(title){ 
    const exs = [];
   
    var headers =[{
   
      columns: [
        [{
          text:"Name ",style:'tableHeader_long'
        }] ,[{
          text:"short_name",style:'tableHeader_long'
        }],
        [{
          text:"Nature",style:'tableHeader_long'
        }],
        [{
          text:"Start Date",style:'tableHeader_long'
        }]  ,[{
          text:"End Date",style:'tableHeader_long'
        }]
      ]
       

    }];
      exs.push(headers);
    for(let i=0;i<this.players.length;i++) {
    
      exs.push(

        [{
          columns: [
            [{
              text: this.players[i].long_name,style:'tablecontent_long'
            }] ,[{
              text:this.players[i].short_name,style:'tablecontent_long'
            }]  ,[{
              text:this.players[i].nature,style:'tablecontent_long'
            }] ,[{
              text:this.players[i].start_date,style:'tablecontent_long'
            }] 
  
            ,[{
              text:this.players[i].end_date,style:'tablecontent_long'
            }]
           ]


        }]
        
        );
      }
    
   this.a= {
      table: {
        widths: ['*'],
        body: [
         ...exs
        ]
       
      }
    };
    //this.exportService.generatePdf(title,this.a);
  }

  add() {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      width: "350px",
      data: {},
    });
  }
}
