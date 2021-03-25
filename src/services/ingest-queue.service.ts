import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { QueueItem } from "src/models/queue-item";
import { OriginType } from "src/models/origin-type";

@Injectable({ providedIn: 'root' })
export class IngestQueueService {

  ingestQueueStream: Subject<QueueItem[]> = new Subject<QueueItem[]>();
  // Move to QueueItem Service
  createQueueItems(files: string[], origin: OriginType): QueueItem[] {

    const queueItems = files.map(f => new QueueItem(f, origin));
    this.ingestQueueStream.next(queueItems);

    return queueItems;
  }


}
