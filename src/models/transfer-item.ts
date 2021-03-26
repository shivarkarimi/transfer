import { OriginType } from './origin-type';
import { Panel } from './panel';
import { TransferStatus as TransferStatus } from './transfer-status';
import { TransferType } from './transfer-type';

export class TransferItem {
  name: string;
  waitingTime: Date;
  fileSize: number;
  panel: Panel;
  status: TransferStatus;
  origin: OriginType;
  transferType: TransferType;


  // has filesystem metadata and associated placeholder panel on UI
  get isReadyForUpload(): boolean {
    return !!this.fileSize && !!this.panel;
  }

  constructor(name: string, origin: OriginType, transferType: TransferType, supported: boolean = true) {
    this.name = name;
    this.waitingTime = new Date();
    this.origin = origin;
    this.status = supported ? TransferStatus.LOADED : TransferStatus.UNSUPPORTED;
    this.transferType = transferType;
  }
}



