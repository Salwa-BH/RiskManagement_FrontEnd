export class Permission{

    public id: number;
    public profile_id: number
    public structure_id: number;
    public read: boolean;
    public create: boolean;
    public edit: boolean;
    public erase: boolean;

    constructor(profile:number,structure:number,read: boolean,create: boolean,edit: boolean,erase: boolean){
        this.profile_id = profile;
        this.structure_id = structure;
        this.read = read;
        this.create = create;
        this.edit = edit;
        this.erase = erase;
    }
}