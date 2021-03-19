import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ChangeNotifierService {

  public changeStream: Subject<void> = new Subject<void>();

  notify(): void {
    this.changeStream.next();
  }
}
