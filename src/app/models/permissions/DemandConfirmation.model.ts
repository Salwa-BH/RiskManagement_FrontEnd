export class DemandConfirmation {
    public id: number;
    public id_user: number;
    public confirmer: number;
    public type_modified: string;
    public action: string;
    public id_elm: number;
    public id_elm_update: number;
    
    constructor(user: number, confirmer: number, type: string, action: string, valid: number, update: number) {
      this.id_user = user;
      this.confirmer = confirmer;
      this.type_modified = type;
      this.action = action;
      this.id_elm = valid;
      this.id_elm_update = update;
    }
  }
  