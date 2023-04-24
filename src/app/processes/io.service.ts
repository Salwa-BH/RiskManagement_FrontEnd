import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IoElement } from '../models/processes/IoElement.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class IoService {

  endpoint = "/api/io-elements/";

  iosChanged = new Subject<IoElement[]>();

  constructor(private http: HttpClient) {}

  refreshIoElement() {
    this.getIoElements().subscribe((data) => this.iosChanged.next(data));
  }

  createIoElement(io: IoElement) {
    this.http
      .post<IoElement>(this.endpoint, io)
      .subscribe((data) => this.refreshIoElement());
  }

  editIoElement(ioId: number, io: IoElement) {
    this.http
      .put<IoElement>(this.endpoint + ioId + '/', io)
      .subscribe((data) => this.refreshIoElement());
  }

  deleteIoElement(ioId: number) {
    this.http
      .delete(this.endpoint + ioId + '/')
      .subscribe((data) => this.refreshIoElement());
  }

  getIoElement(ioId: number) {
    return this.http.get<IoElement>(this.endpoint + ioId + '/');
  }

  getIoElements() {
    return this.http.get<IoElement[]>(this.endpoint);
  }
}
