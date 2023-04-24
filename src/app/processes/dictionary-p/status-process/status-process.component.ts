import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Status_Process } from 'src/app/models/processes/ProcessStatus.model';
import { ProcessService } from "../../process.service";
//import { ExportService } from 'src/app/shared/export.service';
import { DeleteStatusProcessComponent } from './delete-status-process/delete-status-process.component';
import { EditStatusProcessComponent } from './edit-status-process/edit-status-process.component';

@Component({
  selector: 'app-status-process',
  templateUrl: './status-process.component.html',
  styleUrls: ['./status-process.component.css']
})
export class StatusProcessComponent implements OnInit {

  statusP:Status_Process[];
  p=1;
   pageSize = 10;
   pageSizes = [10, 20,50];
   a: { table: { widths: string[]; body: any[]; }; };
   statusForm: FormGroup;

  
  constructor(private processService: ProcessService, 
    private dialog: MatDialog
    //public exportService:ExportService
    ) { }

  ngOnInit(): void {
    this.refreshData();
  }
  handlePageChange(event) {
    this.p = event;

  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.p = 1;
  }
  refreshData() {
    this.processService.getstatusPs().subscribe((statusP) => {
      this.statusP = statusP;
      
    });
  }


  exportexcel(statusP){
    //this.exportService.exportexcel(statusP);
  }
  exportcsv(statusP){ 
    //this.exportService.exportcsv(statusP);
   }
  generatePdf(title){ 
    const exs = [];
   
    var headers =[{
   
      columns: [
        [{
          text:"name",style:'tableHeader'
        }] 
      ]
       

    }];
      exs.push(headers);
    for(let i=0;i<this.statusP.length;i++) {
    
      exs.push(

        [{
          columns: [
            [{
              text: this.statusP[i].name,style:'tablecontent'
            }]  ]


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


  create() {
    let dialogRef = this.dialog.open(EditStatusProcessComponent, {});

    dialogRef.afterClosed().subscribe(() => {this.refreshData()})
  }
  edit(statusid) {
     this.processService.getstatusP(statusid).subscribe((status) => {
       let dialogRef = this.dialog.open(EditStatusProcessComponent, {
         data: { status },
       });

       dialogRef.afterClosed().subscribe(() => {this.refreshData()})
     });
  }

  delete(statusid) {
     this.processService.getstatusP(statusid).subscribe((status) => {
     let dialogRef = this.dialog.open(DeleteStatusProcessComponent, {
       data: { status },
     });

     dialogRef.afterClosed().subscribe(() => {this.refreshData()})
    });
  }

}
