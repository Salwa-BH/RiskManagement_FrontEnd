import { Process } from "./Process.model";
import { IoElement } from "./IoElement.model";

export class ProcessIo {
  public id: number
  public process: number;
  public io_element: number;
  public io_type: string;
  ioDetails: {
    name: string;
  };
}
