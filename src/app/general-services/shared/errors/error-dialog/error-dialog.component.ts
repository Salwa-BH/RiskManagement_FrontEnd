import { getTreeMissingMatchingNodeDefError } from "@angular/cdk/tree";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  errorMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; status?: number }
  ) {}

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage(){
    
      // The backend returned an unsuccessful response code.
      switch (this.data?.status) {
        case 400:
          this.errorMessage = "Bad Request.";
          break;
        case 401:
          this.errorMessage = "You need to log in to do this action.";
          break;
        case 403:
          this.errorMessage = "You don't have permission to access the requested resource.";
          break;
        case 404:
          this.errorMessage = "The requested resource does not exist.";
          break;
        case 412:
          this.errorMessage = "Precondition Failed.";
          break;
        case 500:
          this.errorMessage = "Internal Server Error.";
          break;
        case 503:
          this.errorMessage = "The requested service is not available.";
          break;
        case 422:
          this.errorMessage = "Validation Error!";
          break;
        default:
          this.errorMessage = "Something went wrong! ";
      }
  }

}
