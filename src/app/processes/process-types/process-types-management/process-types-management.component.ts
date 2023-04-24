import { Component, OnInit } from "@angular/core";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { ProcessTypesService } from "../process-types.service";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { EditProcessTypeComponent } from "./edit-process-type/edit-process-type.component";
import { DeleteProcessTypeComponent } from "./delete-process-type/delete-process-type.component";
import { FormControl } from '@angular/forms';
import { ProcessService } from "../../process.service";

@Component({
  selector: "app-process-types-management",
  templateUrl: "./process-types-management.component.html",
  styleUrls: ["./process-types-management.component.css"],
})
export class ProcessTypesManagementComponent implements OnInit {
  processTypes: ProcessType[];
  processTypesSub: Subscription;

 p=1;

  constructor(
    private processTypesService: ProcessTypesService,
    private processService: ProcessService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.processTypesService.getProcessTypes().subscribe((data) => {
      this.processTypes = data;
      this.processTypes.sort((type1, type2) => {
        if (type1.id > type2.id) return 1;
        return -1;
      });
    });
  }

  edit(event) {
    this.processTypesService
      .getProcessType(+event.target.id)
      .subscribe((type) => {
        const dialogRef = this.dialog.open(EditProcessTypeComponent, {
          data: { type, typeId: +event.target.id },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      });
  }

  delete(event) {
    this.processTypesService
      .getProcessType(+event.target.id)
      .subscribe((type) => {
        let dialogRef = this.dialog.open(DeleteProcessTypeComponent, { width: "400px",
          data: { type, typeId: +event.target.id },
        });

        dialogRef.afterClosed().subscribe((deleted) => this.refreshData());
      });
  }

  add() {
    const dialogRef = this.dialog.open(EditProcessTypeComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((added) => this.refreshData());
  }

  makeDefaultType(typeId) {
    // make default type irreversible, so if there is any data in db, don't execute action
    this.processService.getProcesses().then((sub) =>
      sub.subscribe((data) => {
        // if there is no processes, you can change default types
        if(data.length == 0){
          this.processTypesService.setDefaultProcessType(+typeId).then((updated) => {
            this.refreshData();
          });
        }
        else{
          alert("You can not change default type once you have data")
        }
      })
    );
    
  }


}
