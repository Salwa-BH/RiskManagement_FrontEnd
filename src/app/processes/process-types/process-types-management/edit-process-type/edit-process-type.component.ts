import { Component, OnInit, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { Process } from "src/app/models/processes/Process.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EditProcessComponent } from "src/app/processes/process/processes-cartography/processes-list/edit-process/edit-process.component";
import { ProcessService } from "src/app/processes/process.service";
import { ProcessTypesService } from "../../process-types.service";

@Component({
  selector: "app-edit-process-type",
  templateUrl: "./edit-process-type.component.html",
  styleUrls: ["./edit-process-type.component.css"],
})
export class EditProcessTypeComponent implements OnInit {
  selectedParent: number = 0;
  processTypesSub: Subscription;
  processTypes: ProcessType[];

  id: number;
  processTypeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processTypeService: ProcessTypesService
  ) {
    if (this.data.type) {
      let processType = this.data.type;

      this.selectedParent =
        processType?.parents?.length > 0
          ? processType.parents[processType?.parents?.length - 1].id
          : 0;
    } else {
      this.selectedParent = 0;
    }
  }

  ngOnInit() {
    this.processTypeService.getProcessTypes().subscribe((procTypes) => {
      this.processTypes = procTypes;
    });

    this.initForm();
  }

  private initForm() {
    if (this.data.type) {
      let name: string = this.data.type.name;
      let parent: number = this.data.type.parent;

      this.processTypeForm = new FormGroup({
        name: new FormControl(name, Validators.required),
        parent: new FormControl(parent, Validators.required),
      });
    } else {
      this.processTypeForm = new FormGroup({
        name: new FormControl("", Validators.required),
        parent: new FormControl(0, Validators.required),
      });
    }
  }

  onCreateType() {
    const { name, parent } = this.processTypeForm.value;
    if (name.length > 0) {
      this.processTypeService.createProcessType(name, +parent).subscribe(
        () => {
          this.dialogRef.close()
        },
        (error) => alert("An error has occured")
      );
    } else {
      alert("Veuillez remplir les champs requis!");
    }
  }

  onEditType() {
    const { name, parent } = this.processTypeForm.value;
    if (name.length > 0) {
      this.processTypeService
        .renameProcessType(this.data.type.id, name)
        .subscribe(
          () => {
            this.processTypeService
              .changeProcessTypeParent(this.data.type.id, +parent)
              .subscribe(() => {
                this.dialogRef.close();
              });
          },
          (error) => alert("An error has occured")
        );
    } else {
      alert("Veuillez remplir les champs requis!");
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close(this.processTypeForm.value);
  }
}
