export class Player {
  public id: number;
  public short_name: string;
  public long_name: string;
  public nature: string;
  public start_date: string;
  public end_date: string;

  constructor(
    shortName: string,
    longName: string,
    nature: string,
    start_date: string,
    end_date: string
  ) {
    this.short_name = shortName;
    this.long_name = longName;
    this.nature = nature;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
