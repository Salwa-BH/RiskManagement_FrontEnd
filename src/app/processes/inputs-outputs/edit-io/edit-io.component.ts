import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IoElement } from "src/app/models/processes/IoElement.model";
import { IoService } from 'src/app/processes/io.service';
import { Observable } from "rxjs"
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: "app-edit-io",
  templateUrl: "./edit-io.component.html",
  styleUrls: ["./edit-io.component.css"],
})
export class EditIoComponent implements OnInit {

  ioForm: FormGroup;
  IOs:IoElement[];
  filteredIos: Observable<IoElement[]>;

  constructor(
    private ioService: IoService,
    public dialogRef: MatDialogRef<EditIoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data?.io) {
      this.ioForm = new FormGroup({
        name: new FormControl(data.io.name, Validators.required),
        description: new FormControl(data.io.description),
      });
    } else {
      this.ioForm = new FormGroup({
        name: new FormControl("", Validators.required),
        description: new FormControl(""),
      });
    }
  }

  ngOnInit(): void {
    this.ioService.getIoElements().subscribe((products) => {
      this.IOs = products;
      //  Filter pipe for the autocomplete feature on the input box
      this.filteredIos = this.ioForm
        .get("name")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this.filterIos(value))
        );
    });
  }

  private filterIos(value: any): IoElement[] {
    if (typeof value === "number" && value === 0) {
      return [];
    }

    if (this.IOs && value && typeof value !== "number") {
      const filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value.name.toLowerCase();
      return this.IOs.filter((product) =>
        product.name.toLowerCase().includes(filterValue)
      );
    }

    return this.IOs;
  }

  displayFn(io: IoElement): string {
    return  io && io.name ? io.name : "";
  }
  // Function to see if name Exists in the filteredIos array
  nameExists(){
    let nom = this.ioForm.get('name').value;
    let nom2 = this.ioForm.get('name').value.name;
    let egal: Boolean = false;
    this.IOs.forEach(function(io){
     if(io.name == nom || io.name == nom2){
        egal = true;
      }
    });
    if(egal){
      return true;
    }else{
      return false;
    }
 }
  createIo() {
    if (this.ioForm.valid) {
      const { name, description } = this.ioForm.value;
      // If length too large
      if(description.length>300 || name.length>100){
        alert("The input is too large for the fields!");
      }
      // if name already exists
      if(this.nameExists()){
        alert("This name already exists, Please enter a different one");
      } else{
        //If description is null then the name becomes a description also.
        if(description){
          const io = new IoElement(name, description);
          this.ioService.createIoElement(io);
        } else {
          const io = new IoElement(name, name);
          this.ioService.createIoElement(io);
        }
        this.dialogRef.close();
      }
    } else {
      alert("Please complete the required fields !");
    }    
  }

  editIo() {
    if (this.ioForm.valid) {
      const { name, description } = this.ioForm.value;
      const io = new IoElement(name, description);
      this.ioService.editIoElement(this.data?.ioId, io);
      this.dialogRef.close();
    } else {
      alert("Please complete the required fields !");
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
