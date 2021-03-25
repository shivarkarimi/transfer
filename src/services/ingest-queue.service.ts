import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TransferItem } from "src/models/transfer-item";
import { OriginType } from "src/models/origin-type";

@Injectable({ providedIn: 'root' })
export class IngestQueueService {

  ingestQueueStream: Subject<TransferItem[]> = new Subject<TransferItem[]>();
  // Move to QueueItem Service
  createQueueItems(files: string[], origin: OriginType, supported: boolean): TransferItem[] {

    const queueItems = files.map(f => new TransferItem(f, origin, supported));
    this.ingestQueueStream.next(queueItems);

    return queueItems;
  }


}
