import { OriginType } from './origin-type';
import { Panel } from './panel';
import { QueueStatus } from './queue-status';

export class QueueItem {
  name: string;
  waitingTime: Date;
  fileSize: number;
  panel: Panel;
  status: QueueStatus;
  origin: OriginType;


  // has filesystem metadata and associated placeholder panel on UI
  get isReadyForUpload(): boolean {
    return !!this.fileSize && !!this.panel;
  }

  constructor(name: string, origin: OriginType) {
    this.name = name;
    this.waitingTime = new Date();
    this.origin = origin;
    this.status = QueueStatus.LOADED;
  }
}



