import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { OriginType, QueueItem } from "src/models/queue-item";

@Injectable({ providedIn: 'root' })
export class IngestQueueService {

  ingestQueueStream: Subject<QueueItem[]> = new Subject<QueueItem[]>();
  // Move to QueueItem Service
  createQueueItems(files: string[], origin: OriginType): QueueItem[] {
    // TODO should filter files are that are exactly the same - with Set()

    const queueItems = files.map(f => new QueueItem(f, origin));;
    this.ingestQueueStream.next(queueItems);

    return queueItems;
  }


}
