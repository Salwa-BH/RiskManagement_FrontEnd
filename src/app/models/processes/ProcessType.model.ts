export class ProcessType {
  public id: number;
  public name: string;
  public is_default: boolean;
  public color: string;
  public depth: number;
  public children: ProcessType[];
}
