import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TransferItem } from "src/models/transfer-item";


@Injectable({ providedIn: 'root' })
export class TransferService {

  // Make sure items are unique
  transferList: Set<TransferItem> = new Set();
  transferStream: Subject<Set<TransferItem>> = new Subject<Set<TransferItem>>();

  add(items: TransferItem[]): void {
    items.forEach(x => this.transferList.add(x));
    this.transferStream.next(this.transferList)
  }

  remove(item: TransferItem): void {
    this.transferList.delete(item);
    this.transferStream.next(this.transferList)
  }

}
