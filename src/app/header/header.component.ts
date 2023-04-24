import { Component } from "@angular/core";
import { ConfigurationService } from "../configuration.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  constructor(private configService: ConfigurationService, private router: Router) {}

  onInit() {}

  changeMode(modeId: number) {
    this.configService.setMode(modeId);
    switch(modeId){
      case 0: {this.router.navigate(["/unauthorized"]); break;}
      case 1: {this.router.navigate(["/processes/map"]); break;}
      case 2: {this.router.navigate(["/unauthorized"]); break;}
      case 3: {this.router.navigate(["/assignments"]); break;}
      default: break;
    }
  }
}
