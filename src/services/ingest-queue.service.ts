import { Injectable } from "@angular/core";
import { TransferItem } from "src/models/transfer-item";
import { OriginType } from "src/models/origin-type";
import { TransferType } from "src/models/transfer-type";

@Injectable({ providedIn: 'root' })
export class IngestQueueService {

  public ingestList: TransferItem[] = [];

  createQueueItems(files: string[], origin: OriginType, transferType: TransferType, supported: boolean): TransferItem[] {
    return files.map(f => new TransferItem(f, origin, transferType, supported));
  }

  addItems(items: TransferItem[]): void {
    this.ingestList.push(...items);
  }

  emptyList(): void {
    this.ingestList = [];
  }

}
