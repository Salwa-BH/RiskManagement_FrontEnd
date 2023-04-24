import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { ErrorDialogComponent } from "./error-dialog/error-dialog.component";
import { Error } from "./error.model"


@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private opened = false;
  injector: any;
  logs = new Subject<Error[]>();


  constructor(private dialog: MatDialog, public http: HttpClient) {}

  openDialog(message: string, status?: number): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: { message, status },
        maxHeight: "100%",
        width: "540px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true 
      });

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  //service 

  createLog(error:Error){
    this.http.post<Error>("/api/datalog/",error).subscribe((data) => this.refreshDataLog());
  }
  refreshDataLog(){
    this.getDataLog().subscribe((data) => this.logs.next(data))
  }
  getDataLog(): Observable<Error[]>{
    return this.http.get<Error[]>("/api/datalog")
  }
}
