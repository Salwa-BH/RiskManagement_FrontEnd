export class User{
    public id: number;
    public username:string;
    public email:string;

    constructor(name:string, email:string){
        this.username = name;
        this.email = email;
    }
}