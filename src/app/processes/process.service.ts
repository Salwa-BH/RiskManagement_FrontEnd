import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

import { Process } from "../models/processes/Process.model";
import { ProcessType } from "../models/processes/ProcessType.model";
import { tap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { StateManagementService } from "../shared/state-management.service";
import { ProcessPlayer } from "../models/processes/ProcessPlayer.model";
import { ProcessIo } from "../models/processes/ProcessIo.model";
import { CompanySite } from '../models/processes/CompanySite.model';
import { Status_Process } from "../models/processes/ProcessStatus.model";

@Injectable({
  providedIn: "root",
})
export class ProcessService {
  processesChanged = new Subject<Process[]>();
  processesTreeChanged = new Subject<Process[]>();

  private processes: Process[] = [];
  private processesTree: Process[] = [];

  constructor(
    private stateManagementService: StateManagementService,
    private http: HttpClient
  ) {}

  refreshProcesses() {
    this.setProcesses();
    this.setFormattedProcesses();
  }

  setProcesses() {
    this.getProcesses().then((sub) =>
      sub.subscribe((data) => {
        this.processes = data;
        this.processesChanged.next(data);
      })
    );
  }

  async setFormattedProcesses() {
    // waits for the currentCompanySite to be defined before setting it
    let currentCompanySite = await this.stateManagementService.getCurrentCompanySite();

    this.http.get<any[]>("api/processes/get_bulk/").subscribe((data) => {
      let result = [];

      //  Filters the data based on the selected company site
      data = data.filter(
        (process) => process.data.company_site === currentCompanySite.id
      );
      this.formatProcesses(data, result);
      this.processesTree = result;
      this.processesTreeChanged.next(this.processesTree.slice());
    });
  }

  async getProcesses(): Promise<Observable<Process[]>> {
    let companySite = await this.stateManagementService.getCurrentCompanySite();

    return this.http
      .get<Process[]>(`api/processes/?company_site=${companySite.id}`)
      .pipe(tap((data) => (this.processes = data)));
  }

  formatProcesses(data, result) {
    // Must add a check to set the current company site if it is not defined
    // (Check the other getters too)

    data.map((process, index) => {
      result.push({
        id: process.id,
        ...process.data,
        children: [],
      });

      if (process && process.children) {
        this.formatProcesses(process.children, result[index].children);
      } else {
        this.processesTreeChanged.next(this.processesTree.slice());
      }
    });
  }

  /*
   * Waits for the company site to be defined if it isn't,
   * then fetches processes tree and formats it
   *
   * Returns a promise containing an observable allowing us to
   * get the processes tree
   */
  async getFormattedProcesses(): Promise<Observable<Process[]>> {
    // waits for the currentCompanySite to be defined before setting it
    let currentCompanySite = await this.stateManagementService.getCurrentCompanySite();

    return this.http.get<any[]>("api/processes/get_bulk/").pipe(
      map((data) => {
        let result = [];

        //  Filters the data based on the selected company site
        data = data.filter(
          (process) => process.data.company_site === currentCompanySite.id
        );

        this.formatProcesses(data, result);
        this.processesTree = result;
        this.processesTreeChanged.next(this.processesTree.slice());
        return this.processesTree;
      })
    );
  }

  getFormattedProcessChildren(processId: number): Observable<Process[]> {
    return this.http.get<Process[]>(
      `api/processes/${processId}/get_process_tree/`
    );
  }

  /*
   * Allows to filter a process children of a precise type
   *
   * Returns an array of a process's children based on there
   * depth on the tree
   */
  getProcessChildrenByDepth(
    process: Process,
    depth: number,
    results: Process[]
  ) {
    if (depth > 1) {
      depth = depth - 1;
      process?.children?.map((childProcess) =>
        this.getProcessChildrenByDepth(childProcess, depth, results)
      );
    } else {
      results.push(process);
    }
  }

  /**
   * Make sure the count array is initialized and all its values are zeros
   * Every index on the array represents a depth
   *
   * Arguments :
   *  A process that we want to start counting its children
   *  An empty array of number type
   *  A number variable initialized with the value 1
   *
   * Returns an array containing the count of children on every depth (process type)
   */
  getProcessChildrenCountByDepth(
    process: Process,
    count: number[],
    depthCounter: number
  ) {
    if (process) {
      // if the arg array doesn't contain enough indexes
      // create the necessary ones
      if (count[depthCounter] === undefined) count[depthCounter] = 0;

      // increment the count of elements of the current depth
      count[depthCounter]++;

      // increment the depthCounter to log the next level elements count
      depthCounter++;

      this.getProcess(process.id).subscribe((proc) => {
        // count the next level children of the process that was passed as an arg
        proc.children?.map((child) =>
          this.getProcessChildrenCountByDepth(child, count, depthCounter)
        );
      });
    }
  }

  getProcess(processId: number) {
    return this.http.get<Process>("api/processes/" + processId);
  }

  addProcess(
    title: string,
    description: string,
    aim: string,
    process_type: number,
    parent: number,
    start_date: string,
    end_date: string
  ) {
    return this.stateManagementService
      .getCurrentCompanySite()
      .then((companySite) => {
        let process = new Process(
          title,
          description,
          aim,
          process_type,
          companySite.id,
          start_date,
          end_date
        );
        let endpoint =
          parent === 0
            ? "api/processes/"
            : `api/processes/${parent}/add_child/`;
        return Promise.resolve(this.http.post(endpoint, process));
        // .subscribe((data) => this.refreshProcesses());
      });
  }

  editProcess(
    processId: number,
    data: any
  ) {
    if (typeof data?.parent !== "undefined") this.changeParent(processId, data?.parent);

    
    let endpoint = `api/processes/${processId}/`;
    return this.stateManagementService
      .getCurrentCompanySite()
      .then((companySite) => {

        data.company_site = companySite.id
        
        return Promise.resolve(
          this.http.patch(endpoint, data));
      });
  }

  changeParent(processId: number, newParentId: number) {
    let endpoint = `api/processes/${processId}/change_parent/`;
    this.http
      .patch(endpoint, {
        parent: newParentId,
      })
      .subscribe((data) => this.refreshProcesses());
  }

  renameProcess(processId: number, newTitle: string) {
    return this.http.patch("api/processes/" + processId + "/", {
      title: newTitle,
    });
  }

  changeProcessStatus(processId: number, newStatus: string) {
    return this.http.patch("api/processes/" + processId + "/", {
      status: newStatus,
    });
  }

  deleteProcess(processId: number) {
    this.http
      .delete(`api/processes/${processId}/`)
      .subscribe((data) => this.refreshProcesses());

    this.processes = this.processes.filter((proc) => proc.id !== processId);
  }

  mergeProcesses(firstProcessId, secondProcessId, mergedProcessName) {
    return this.http.post("api/processes/merge_processes/", {
      firstProcess: firstProcessId,
      secondProcess: secondProcessId,
      newProcessName: mergedProcessName,
    });
    // .subscribe((data) => this.refreshProcesses());
  }

  getProcessDefaultTypeChildrenCount(processId) {
    return this.http.get<any>(`api/processes/${processId}/get_process_default_type_children_count/`)
  }

  getProcessPlayers(processId) {
    return this.http.get<ProcessPlayer[]>(
      "api/process-players/?process=" + processId
    );
  }

  setProcessPlayer(processId: number, playerId: number, playerRole: string) {
    return this.http.post("api/process-players/", {
      process: processId,
      player: playerId,
      playerRole,
    });
  }

  deleteProcessPlayer(processPlayerId: number) {
    return this.http.delete("api/process-players/" + processPlayerId + "/");
  }

  getProcessIOs(processId) {
    return this.http.get<ProcessIo[]>("api/process-io/?process=" + processId);
  }

  setProcessIo(processId: number, ioId: number, ioType: string) {
    return this.http.post("api/process-io/", {
      process: processId,
      io_element: ioId,
      io_type: ioType,
    });
  }

  deleteProcessIo(processIoId: number) {
    return this.http.delete("api/process-io/" + processIoId + "/");
  }

  //status process
getstatusPs() {
  return this.http.get<Status_Process[]>("api/statusProcess/");
}

getstatusP(statusId: number) {
  return this.http.get<Status_Process>(`api/statusProcess/${statusId}/`);
}

createstatusP(status:Status_Process) {
  return this.http.post<Status_Process>("api/statusProcess/",status);
}

updatestatusP(statusId: number, status: Status_Process) {
  return this.http.patch<Status_Process>(`api/statusProcess/${statusId}/`,status);
}

deletestatusP(statusId:Status_Process) {
  return this.http.delete(`api/statusProcess/${statusId}/`);
}
}
