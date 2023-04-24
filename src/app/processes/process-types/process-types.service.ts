import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { tap, map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProcessTypesService {
  processTypes: ProcessType[];
  processTypeTreeChanged: Subject<ProcessType[]>;
  processTypesTree: ProcessType[];

  constructor(private http: HttpClient) {
    this.processTypes = [];
    this.processTypesTree = [];
    this.processTypeTreeChanged = new Subject();
  }

  createProcessType(name: string, parent: number) {
    let endpoint =
      parent === 0
        ? "api/process-types/"
        : `api/process-types/${parent}/add_child/`;
        
    return this.http.post(endpoint, { name, is_default: false });
  }

  getProcessType(processTypeId: number) {
    return this.http.get<ProcessType>("api/process-types/" + processTypeId);
  }

  getProcessTypes() {
    return this.http.get<ProcessType[]>("api/process-types/").pipe(
      tap((data) => {
        this.processTypes = data;
        return data;
      })
    );
  }

  formatProcessTypes(data, result) {
    data.map((processTypes, index) => {
      result.push({
        id: processTypes.id,
        ...processTypes.data,
        children: [],
      });

      if (processTypes && processTypes.children) {
        this.formatProcessTypes(processTypes.children, result[index].children);
      } else {
        this.processTypeTreeChanged.next(this.processTypesTree.slice());
      }
    });
  }

  getFormattedProcessTypes(): Observable<ProcessType[]> {
    return this.http.get<ProcessType[]>("api/process-types/get_tree/").pipe(
      map((data) => {
        let result = [];
        this.formatProcessTypes(data, result);
        this.processTypesTree = result;
        this.processTypeTreeChanged.next(this.processTypesTree.slice());
        return data;
      })
    );
  }

  getDefaultProcessType(): Observable<ProcessType[]> {
    return this.http.get<ProcessType[]>("/api/process-types/?is_default=true");
  }

  setDefaultProcessType(newDefaultProcessTypeId: number) {
    console.log("here");
    return new Promise<void>((resolve) => {
      // Get current default process type
      this.getDefaultProcessType().subscribe((currentDefaultType) => {
        console.log(currentDefaultType);
        if (currentDefaultType.length !== 0) {
          //  Unset current default process type
          this.updateProcessTypeStatus(
            currentDefaultType[0].id,
            false
          ).subscribe((updated) => {
            //  Set newer default process type
            this.updateProcessTypeStatus(
              newDefaultProcessTypeId,
              true
            ).subscribe(() => {
              resolve();
            });
          });
        } else {
          this.updateProcessTypeStatus(newDefaultProcessTypeId, true).subscribe(
            (updated) => {
              resolve();
            }
          );
        }
      });
    });
  }

  renameProcessType(
    processTypeId: number,
    name: string
  ): Observable<ProcessType> {
    return this.http.patch<ProcessType>(
      `/api/process-types/${processTypeId}/`,
      {
        name,
      }
    );
  }

  updateProcessTypeStatus(
    processTypeId: number,
    is_default: boolean
  ): Observable<ProcessType> {
    return this.http.patch<ProcessType>(
      `/api/process-types/${processTypeId}/`,
      {
        is_default,
      }
    );
  }

  changeProcessTypeParent(
    processTypeId: number,
    newParentId: number
  ): Observable<ProcessType> {
    return this.http.patch<ProcessType>(
      `/api/process-types/${processTypeId}/change_parent/`,
      {
        parent: newParentId,
      }
    );
  }

  deleteProcessType(processTypeId: number): Observable<Object> {
    return this.http.delete(`/api/process-types/${processTypeId}/`);
  }
}
