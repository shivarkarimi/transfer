import { Injectable } from "@angular/core";
import { TransferItem } from "src/models/transfer-item";
import { OriginType } from "src/models/origin-type";

@Injectable({ providedIn: 'root' })
export class IngestQueueService {

  public ingestList: TransferItem[] = [];

  createQueueItems(files: string[], origin: OriginType, supported: boolean): TransferItem[] {
    return files.map(f => new TransferItem(f, origin, supported));
  }

  addItems(items: TransferItem[]): void {
    this.ingestList.push(...items);
  }

  emptyList(): void {
    this.ingestList = [];
  }

}
