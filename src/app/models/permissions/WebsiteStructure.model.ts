export class WebsiteStructure{
    public id: number;
    public structure:string;
    public sub_structure:string;

    constructor(structure:string, sub_structure:string){
        this.structure = structure;
        this.sub_structure = sub_structure;
    }
}