export class CompanySite {
  public id: number;
  public name: string;
  public is_default: boolean;

  constructor(name: string, is_default: boolean) {
    this.id = 0;
    this.name = name;
    this.is_default = is_default;
  }
}
