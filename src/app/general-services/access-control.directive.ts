import { Directive, Input, OnInit, ElementRef } from "@angular/core";
import { WebsiteStructure } from "../models/permissions/WebsiteStructure.model"
import { WebsiteStructureService } from "../permissions/services/website-structure.service"
import { Permission } from "../models/permissions/Permission.model"
import { PermissionsService } from "../permissions/services/permissions.service"
import { UserAssign } from "../models/permissions/UserAssign";
import { Router } from "@angular/router";

@Directive({
  selector: "[accessControl]",
})

export class AccessControlDirective implements OnInit {

  @Input("moduleType") moduleType: string; // name of the webstructure
  @Input("subModuleType") subModuleType: string; // name of the sub-webstructure
  @Input("accessType") accessType: string; // view, create, edit and delete

  userConnectedAssignProfile = parseInt(localStorage.getItem('userConnectedAssignProfile')); // profile connected
  //userConnectedAssignProfile = 1; // profile connected
  
  userConnectedAssign: UserAssign
  permissions: Permission[] = []
  structures: WebsiteStructure[]

  constructor(private elementRef: ElementRef, 
    private websiteService: WebsiteStructureService,
    private permissionService: PermissionsService,
    private router: Router
    ) {}

  ngOnInit() {
    // If the user has a profile
    this.userConnectedAssignProfile=1;
    if(this.userConnectedAssignProfile){
      //console.log(parseInt(localStorage.getItem('userConnectedAssignProfile')));
      this.elementRef.nativeElement.style.display = "block";
      // get structures
      this.websiteService.getWebsiteStructures().subscribe((data2) =>{
          this.structures = data2;
          // specific structure that we want to know the access to 
          const id_structure = this.structures.find( s => (s.structure.match(this.moduleType)  && s.sub_structure.match(this.subModuleType) )).id
          
          // get permissions
          this.permissionService.getPermissions().subscribe( data => 
              {
                  // get permissions of connected user
                  data.forEach(( p ) => {
                      if(p.profile_id == Number(this.userConnectedAssignProfile)){
                        this.permissions.push(p)
                      }
                  });

                  // permission of the specific structure of the profile
                  const perm = this.permissions.find( p => p.structure_id == id_structure);
                  // read
                  if(this.accessType.match("read")){
                    this.elementRef.nativeElement.style.display = perm.read ? "block" : "none"
                    // IF DON'T HAVE ACCESS, GO TO UNAUTHORIZED PAGE
                    if(!perm.read){
                      this.router.navigate(["/unauthorized"])
                    }
                  }
                  // creae 
                  if(this.accessType.match("create")){
                    this.elementRef.nativeElement.style.display = perm.create ? "block" : "none"
                  }
                  // edit 
                  if(this.accessType.match("edit")){
                    this.elementRef.nativeElement.style.display = perm.edit ? "block" : "none"
                  }
                  // erase
                  if(this.accessType.match("erase")){
                    this.elementRef.nativeElement.style.display = perm.erase ? "block" : "none"
                  }
                    
              }      
            )
      })
    }
    else{ // if user has no profile.
      this.router.navigate(["/unauthorized"])
    }
    
    
  }

}