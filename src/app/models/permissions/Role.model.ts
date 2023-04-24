export class Role{
    public id: number;
    public name:string;
    public description:string;
    confirmation: boolean;
    public depth: number;
    public parents: Role[];
    public children: Role[];

    constructor(name:string, description:string, confirmation: boolean){
        this.name = name;
        this.description = description;
        this.confirmation = confirmation;
    }
}