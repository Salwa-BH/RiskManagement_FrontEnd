import { MinifiedProcess } from "./MinifiedProcess.model";

export class Process {
  public id: number;
  public title: string;
  public description: string;
  public aim: string;
  public status: string;
  public start_date: string;
  public end_date: string;
  public financial_level_1: number
  public financial_level_2: number
  public financial_level_3: number
  public financial_level_4: number
  public financial_level_5: number
  public process_type: number;
  public company_site: number;
  public parents: Process[];
  public children: Process[];
  public depth: number;
  public details: {};
  customers: any[];
  suppliers: any[];
  inputs: any[];
  outputs: any[];

  constructor(
    title: string,
    desc: string,
    aim: string,
    process_type: number,
    company_site: number,
    start_date: string,
    end_date: string
  ) {
    this.title = title;
    this.description = desc;
    this.aim = aim;
    this.process_type = process_type;
    this.company_site = company_site;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
