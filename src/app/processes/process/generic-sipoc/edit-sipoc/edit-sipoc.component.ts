import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProcessService } from "src/app/processes/process.service";
import { Process } from "src/app/models/processes/Process.model";
import { ProcessType } from "src/app/models/processes/ProcessType.model";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map, filter } from "rxjs/operators";
import { ProcessTypesService } from "src/app/processes/process-types/process-types.service";
import { Player } from "src/app/models/processes/Player.model";
import { IoElement } from "src/app/models/processes/IoElement.model";
import { PlayerService } from "src/app/processes/players.service";
import { IoService } from "src/app/processes/io.service";
import { ProcessPlayer } from "src/app/models/processes/ProcessPlayer.model";
import { ProcessIo } from "src/app/models/processes/ProcessIo.model";
import { SelectItem, PrimeNGConfig } from "primeng/api";
import {MultiSelectModule} from 'primeng/multiselect';
import {SelectItemGroup} from 'primeng/api';

interface City {
  name: string,
  code: string
}

interface Country {
  name: string,
  code: string
}
@Component({
  selector: "app-edit-sipoc",
  templateUrl: "./edit-sipoc.component.html",
  styleUrls: ["./edit-sipoc.component.scss"],
})


export class EditSipocComponent implements OnInit {
  
  processes: Process[];
  processTypes: ProcessType[];

  players: Player[];
  suppliers_selected: Player[]=[];

  selectedPlayer: any=[];
  suppliers: ProcessPlayer[];
  customers: ProcessPlayer[];

  ios: IoElement[];
  inputs: ProcessIo[];
  outputs: ProcessIo[];

  
  filteredPlayers: Player[];
  filteredIos: IoElement[];

  sipocForm: FormGroup;
  filteredProcesses: Process[];

  processIOs: ProcessIo[];
  processPlayers: ProcessPlayer[];

  name_supplier_search:string = 'ss';
  
  constructor(
    public dialogRef: MatDialogRef<EditSipocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private processService: ProcessService,
    private processTypeService: ProcessTypesService,
    private playerService: PlayerService,
    private ioService: IoService,
    private primengConfig: PrimeNGConfig
  ) {
    {
      
    this.sipocForm = new FormGroup({
      processType: new FormControl(),
      process: new FormControl(),
      suppliers: new FormControl(),
      customers: new FormControl(),
      inputs: new FormControl(),
      outputs: new FormControl(),
    });
    }
  }

  
  ngOnInit() {
    if (this.data.process) {
      this.processService.getProcesses().then((sub) =>
        sub.subscribe((processes) => {
          this.processes = processes;

          this.filteredProcesses = this.processes.filter(
            (process) => process.process_type === this.data.process.process_type
          );

          this.sipocForm = new FormGroup({
            processType: new FormControl(
              this.data.process.process_type,
              Validators.required
            ),
            process: new FormControl(this.data.process.id, Validators.required),
            suppliers: new FormControl(),
            customers: new FormControl(),
            inputs: new FormControl(),
            outputs: new FormControl(),
          });

          this.getPlayers(this.data.process.id);
          this.getIos(this.data.process.id);
        })
      );
    }

    // Getting all the process types
    this.processTypeService.getProcessTypes().subscribe((types) => {
      this.processTypes = types;
    });

    // Getting all the processes
    this.processService.getProcesses().then((sub) =>
      sub.subscribe((processes) => {
        this.processes = processes;
      })
    );

    // Getting all the players
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
      this.filteredPlayers=data;
    });

    // Getting all the I/Os
    this.ioService.getIoElements().subscribe((data) => {
      this.ios = data;
    });

    // Only show the processes corresponding to the type the user chose
    this.sipocForm
      .get("processType")
      .valueChanges.subscribe((selectedProcessTypeId) => {
        this.filteredProcesses = this.processes.filter(
          (process) => process.process_type === selectedProcessTypeId
        );
      });

    // Show the players and I/Os corresponding to the selected process
    this.sipocForm
      .get("process")
      .valueChanges.subscribe((selectedProcessId) => {
        this.getPlayers(selectedProcessId);
        this.getIos(selectedProcessId);
      });
      
  }
  onKeyChangePlayer(value) { 
    //debugger;
    //console.log(this.sipocForm.get("name_supplier_search").value);

    this.filteredPlayers = this.searchPlayer(value);
    //this.name_supplier_search="salwa"
    //console.log(this.name_supplier_search);
    //console.log(this.sipocForm.get("suppliers").value);
  }
  searchPlayer(value: string):Player[] { 
    let filter = value.toLowerCase();
    return this.players.filter(option => option.short_name.toLowerCase().includes(filter));
  }
  changeSupplier(event){
    console.log(event);
    console.log( this.sipocForm.get("suppliers").value);
    
    
    //console.log(this.suppliers)
    //console.log(player)
    //console.log(event.source.value, event.source.selected);
    //this.sipocForm.controls["name_supplier_search"].setValue("")
    //console.log(this.sipocForm.get("name_supplier_search").value);
    
  let suppliers = this.sipocForm.get("suppliers").value;
    let player = this.players.find(p => p.id == event.source.value)
    console.log(player);
    
    if(event.source.selected){
      if(suppliers.indexOf(player.id)<0){
        suppliers.push(player.id)
        this.suppliers_selected.push(player)
       /* this.players.filter( (p) => p.id == player.id );
        const process = this.sipocForm.value.process;
        
        let a:ProcessPlayer = new ProcessPlayer(process, player.id, "Supplier")
        this.suppliers.push(a)
        this.suppliers=suppliers*/
      }
    }
    else{
      if(suppliers.indexOf(player.id>-1)){
        suppliers = suppliers.filter(item => item!= player.id)
        this.suppliers_selected=this.suppliers_selected.filter(item => item.id!= player.id)
        //this.suppliers=suppliers
      }
    }
    //this.sipocForm.get("name_supplier").setValue("21");
    //console.log(suppliers);
    let sup=[]
    this.suppliers.forEach(s => sup.push(s.player))
    //this.sipocForm.get("suppliers").setValue(suppliers);
    /*this.sipocForm
        .get("suppliers")
        .setValue(suppliers.map((sp) => sp));*/
      
    //console.log(suppliers);
    
  }

  onKeyChangeIo(value) { 
    this.filteredIos = this.searchIo(value);
  }
  searchIo(value: string):IoElement[] { 
    let filter = value.toLowerCase();
    return this.ios.filter(option => option.name.toLowerCase().includes(filter));
  }

  private getPlayers(processId) {
    
    // Getting and setting the current process players
    this.processService.getProcessPlayers(processId).subscribe((data) => {
      this.processPlayers = data;

      this.suppliers = data.filter(
        (player) => player.playerRole === "Supplier"
      );
      this.players.forEach( p => {
        if(this.suppliers.find(sup=> sup.player == p.id)){
          this.suppliers_selected.push(p);
        }
      })
      
      this.sipocForm
        .get("suppliers")
        .setValue(this.suppliers.map((supplier) => supplier.player));
      
      this.customers = data.filter(
        (player) => player.playerRole === "Customer"
      );
      this.sipocForm
        .get("customers")
        .setValue(this.customers.map((customer) => customer.player));
    });
  }

  private getIos(processId) {
    // Getting and setting the current process IOs
    this.processService.getProcessIOs(processId).subscribe((data) => {
      this.processIOs = data;

      this.inputs = data.filter((io) => io.io_type === "Input");
      this.sipocForm
        .get("inputs")
        .setValue(this.inputs.map((input) => input.io_element));

      this.outputs = data.filter((io) => io.io_type === "Output");
      this.sipocForm
        .get("outputs")
        .setValue(this.outputs.map((output) => output.io_element));
    });
  }

  clearCurrentPlayers() {
    this.processPlayers.map((processPlayer) => {
      this.processService
        .deleteProcessPlayer(processPlayer.id)
        .subscribe(() => {});
    });
  }

  clearCurrentIos() {
    this.processIOs.map((processIo) => {
      this.processService.deleteProcessIo(processIo.id).subscribe(() => {});
    });
  }

  onEditSipoc() {
    console.log("called");
    // Delete all the current process players and I/Os
    this.clearCurrentPlayers();
    this.clearCurrentIos();

    const { suppliers, customers, inputs, outputs } = this.sipocForm.value;
    const processId = this.sipocForm.value.process;

    suppliers.map((supplierId) => {
      this.processService
        .setProcessPlayer(processId, supplierId, "Supplier")
        .subscribe(() => {});
    });

    customers.map((customerId) => {
      this.processService
        .setProcessPlayer(processId, customerId, "Customer")
        .subscribe(() => {});
    });

    inputs.map((inputId) => {
      this.processService
        .setProcessIo(processId, inputId, "Input")
        .subscribe(() => {});
    });

    outputs.map((outputId) => {
      this.processService
        .setProcessIo(processId, outputId, "Output")
        .subscribe(() => {});
    });

    this.onCloseDialog();
  }

  onCloseDialog() {
    console.log(this.sipocForm.value);
    this.dialogRef.close();
  }
}
