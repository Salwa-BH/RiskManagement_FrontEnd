import { Component ,ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { filter, map, mergeMap } from "rxjs/operators";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  visibility:boolean=true;

  title = "Risk Tracer";

  constructor(translate: TranslateService, private router: Router , private activatedRoute:ActivatedRoute, private authservice: AuthService, ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("en");
  }

  ngOnInit(){
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          // test if componant concern authentication, then hide header and sidebar // if to reset new pwd, as the link contains token
          let table= ["/auth","/forgot-password","/verify-token"];
          if( table.includes(this.router.url) || this.router.url.includes("reset-password")){
            this.visibility=false;
          }
          else{this.visibility = true}
        });
    }
}
