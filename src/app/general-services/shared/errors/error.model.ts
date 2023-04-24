export class Error{
    //public id: number;
    public name:string;
    public headers:string;
    public status:number
    public statusText:string;
    public message:string;
    public url:string;
    public email:string;
    public timestamp:string;

    constructor(name:string, headers:string, status:number, statusText:string, message:string, url:string, email:string, timestamp:string){
        this.name = name;
        this.headers = headers;
        this.status =  status;
        this.statusText = statusText;
        this.message = message;
        this.url = url;
        this.email = email; 
        this.timestamp = timestamp
    }
}