import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Player } from "../models/processes/Player.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  endpoint = "/api/players/";

  playersChanged = new Subject<Player[]>();

  constructor(private http: HttpClient) {}

  refreshPlayers() {
    this.getPlayers().subscribe((data) => this.playersChanged.next(data));
  }

  createPlayer(player: Player) {
    this.http
      .post<Player>(this.endpoint, player)
      .subscribe((data) => this.refreshPlayers());
  }

  editPlayer(playerId: number, player: Player) {
    this.http
      .put<Player>(this.endpoint + playerId + '/', player)
      .subscribe((data) => this.refreshPlayers());
  }

  deletePlayer(playerId: number) {
    this.http
      .delete(this.endpoint + playerId + "/")
      .subscribe((data) => this.refreshPlayers());
  }

  getPlayer(playerId: number) {
    return this.http.get<Player>(this.endpoint + playerId + "/");
  }

  getPlayers() {
    return this.http.get<Player[]>(this.endpoint);
  }
}
