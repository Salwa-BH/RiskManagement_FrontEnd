export class ProcessPlayer {
  public id: number;
  public process: number;
  public player: number;
  public playerRole: string;
  public playerDetails: {
    name: string;
    short_name: string;
  };

  constructor(process:number,player:number,role:string){
    this.process = process;
    this.player = player;
    this.playerRole = role;
  }
  
}
