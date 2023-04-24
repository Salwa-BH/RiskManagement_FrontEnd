import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RolesService } from '../../services/roles.service'
import { ProfilesService } from '../../services/profiles.service'
import { GroupesService } from "../../services/groupes.service"

@Component({
  selector: 'app-delete-assignment',
  templateUrl: './delete-assignment.component.html',
  styleUrls: ['./delete-assignment.component.css']
})
export class DeleteAssignmentComponent implements OnInit {
  type:string;

  constructor(private roleService: RolesService, 
    private profileService: ProfilesService,
    private groupService: GroupesService,
    public dialogRef: MatDialogRef<DeleteAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      if(this.data?.type.match("role")!=null){
        this.type="role";
      } 
              
      if(this.data?.type.match("profile")!=null){
        this.type = "profile"
      }
      if(this.data?.type.match("group")!=null){
        this.type = "group"
      }
    }

  ngOnInit(): void {
  }

  onConfirmDeletion() {
    if(this.type.match("role")!= null){
      this.roleService.deleteRole(this.data?.role.id);
      this.onCloseDialog();
    }
    if(this.type.match("profile")!= null){
      this.profileService.deleteProfile(this.data?.profile.id);
      this.onCloseDialog();
    }
    if(this.type.match("group")!= null){
      this.groupService.deleteGroup(this.data?.group.id);
      this.onCloseDialog();
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
