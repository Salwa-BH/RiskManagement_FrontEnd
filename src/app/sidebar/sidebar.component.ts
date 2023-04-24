import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CompanyService } from "../shared/company.service";
import { CompanySite } from "../models/processes/CompanySite.model";
import { StateManagementService } from "../shared/state-management.service";
import { ConfigurationService } from "../configuration.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ToastrService } from 'ngx-toastr';
import { HostListener } from "@angular/core"

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  screenWidth: number=0;
  selectedMode: number = 0;
  isVisible=true;
  languageForm: FormGroup;
  companySiteForm: FormGroup;
  val=0;
close(){
  this.isVisible=!this.isVisible;
}


changeMode(modeId: number) {
  this.configService.setMode(modeId);
}

  public currentCompanySite: CompanySite = new CompanySite("", false);
  companySitesList: CompanySite[];

  constructor(
    private configService: ConfigurationService,
    private translate: TranslateService,
    private stateManagementService: StateManagementService,
    private companyService: CompanyService,
    private configurationService: ConfigurationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.languageForm = new FormGroup({
      languageSelector: new FormControl(this.translate.currentLang),
    });
    this.companySiteForm = new FormGroup({
      companySiteSelector: new FormControl(),
    });

    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.screenWidth = window.innerWidth;
     if(this.screenWidth < 768){
        this.isVisible=false;
     }
     if(this.screenWidth >= 768){
      this.isVisible=true;
   }
  }
  ngOnInit(): void {
   


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes("processes")) {
          this.selectedMode = 1;
        }
        else if (event.url.includes("risks")) {
          this.selectedMode = 2;
        }
        else if (event.url.includes("manage")) {
          this.selectedMode = 3;
        }
      }
    });

    this.languageForm
      .get("languageSelector")
      .valueChanges.subscribe((value) => {
        if (value !== " ") this.translate.use(value);
      });

    //  Sets the default site as the default option in the sites list
    this.companyService.getDefaultCompanySite().subscribe((data) => {
      /*
       *  Gets the first element of the returned array and not directly
       *  an object because django filtering system returns data in an array
       *  even if it is a single object
       */
      if (data.length === 0) {
        this.toastr.error("Please set a default company site first")
        alert("Please set a default company site first");
        this.router.navigateByUrl("company-sites/manage");
      } else {
        this.currentCompanySite = data[0];
        this.companySiteForm.get("companySiteSelector").setValue(data[0].id);
        this.stateManagementService.setCurrentCompanySite(data[0]);
      }
    });

    // Loads all the company sites
    this.companyService.getCompanySites().subscribe((data) => {
      this.companySitesList = data;
    });

    /*
     *  Listens to changes on the company sites selection list
     *  and sets the new site value on the state management service
     */
    this.companySiteForm
      .get("companySiteSelector")
      .valueChanges.subscribe((siteId) => {
        if (this.companySitesList !== undefined) {
          let newSite = this.companySitesList.find( 
            (site) => site.id === +siteId
          );
          this.stateManagementService.setCurrentCompanySite(newSite);
        }
      });

    this.configurationService.selectedMode.subscribe((mode) => {
      this.selectedMode = mode;
    });
  }
  changelanguage(){
   
    switch (this.val) {
      case 0:
        this.translate.use("fr");
        this.val=1;
          break;
      case 1:
        this.translate.use("en");
        this.val=0;
          break;
      
  }
 
    

  }
  logout() {
    console.log("log out");
    
    this.authService.logout();
  }
}
