import { OriginType } from './origin-type';
import { Panel } from './panel';
import { TransferStatus as TransferStatus } from './transfer-status';

export class TransferItem {
  name: string;
  waitingTime: Date;
  fileSize: number;
  panel: Panel;
  status: TransferStatus;
  origin: OriginType;


  // has filesystem metadata and associated placeholder panel on UI
  get isReadyForUpload(): boolean {
    return !!this.fileSize && !!this.panel;
  }

  constructor(name: string, origin: OriginType) {
    this.name = name;
    this.waitingTime = new Date();
    this.origin = origin;
    this.status = TransferStatus.LOADED;
  }
}



