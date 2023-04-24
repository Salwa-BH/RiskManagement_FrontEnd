import { Component, OnInit } from "@angular/core";
import { DeleteIoComponent } from '../delete-io/delete-io.component';
import { EditIoComponent } from '../edit-io/edit-io.component';
import { IoService } from 'src/app/processes/io.service';
import { Player } from 'src/app/models/processes/Player.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IoElement } from 'src/app/models/processes/IoElement.model';
//import {ExportService } from "src/app/shared/export.service";

@Component({
  selector: "app-io-management",
  templateUrl: "./io-management.component.html",
  styleUrls: ["./io-management.component.css"],
})
export class IoManagementComponent implements OnInit {
  IOs: IoElement[];
 p=1;
 pageSize = 10;
  pageSizes = [10, 20,50];
  a: { table: { widths: string[]; body: any[]; }; };
  IOsSub: Subscription;

  constructor(private ioService: IoService,
     public dialog: MatDialog,
     //public exportService:ExportService,
     ) {}

  ngOnInit(): void {
    this.ioService.getIoElements().subscribe((data) => (this.IOs = data));
    this.IOsSub = this.ioService.iosChanged.subscribe(
      (data) => (this.IOs = data)
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
    this.IOsSub.unsubscribe();
  }

  edit(event) {
    this.ioService.getIoElement(event.target.id).subscribe((io) => {
      const dialogRef = this.dialog.open(EditIoComponent, {
        width: "350px",
        data: { io, ioId: +event.target.id },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    });
  }

  delete(event) {
    this.ioService.getIoElement(event.target.id).subscribe((io) => {
      
      this.dialog.open(DeleteIoComponent, { width: "400px",
        data: { io, ioId: +event.target.id },
      });
    });
  }

  add() {
    const dialogRef = this.dialog.open(EditIoComponent, {
      data: {},
    });
  }

  exportexcel(IOs){
    //this.exportService.exportexcel(IOs);
  }
  exportcsv(IOs){ 
    //this.exportService.exportcsv(IOs);
   }
  generatePdf(title){ 
    const exs = [];
   
    var headers =[{
   
      columns: [
        [{
          text:"Name ",style:'tableHeader'
        }] ,[{
          text:"Description",style:'tableHeader'
        }],
      ]
       

    }];
      exs.push(headers);
    for(let i=0;i<this.IOs.length;i++) {
    
      exs.push(

        [{
          columns: [
            [{
              text: this.IOs[i].name,style:'tablecontent'
            }] ,[{
              text:this.IOs[i].description,style:'tablecontent'
            }] ,
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
 
}

