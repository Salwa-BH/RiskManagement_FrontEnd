import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ConfigurationItem } from './models/configuration.model';

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  // represents the current mode chosen by the user :
  // 0 : process mapping, 1: risk mapping, 2: dictionary
  selectedMode: Subject<number> = new Subject();

  constructor(private http: HttpClient) {}

  setMode(modeId) {
    this.selectedMode.next(modeId);
  }

  getLevelCount() {
    return this.http.get<ConfigurationItem>("/api/configuration/?key=levelsCount");
  }
}
