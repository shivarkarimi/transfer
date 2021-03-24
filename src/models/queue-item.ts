import { Panel } from './panel';

export enum OriginType {
  PHOTOSHOP,
  MANUAL
}

export class QueueItem {
  name: string;
  waitingTime: Date;
  fileSize: number;
  panel: Panel;
  status: any;
  origin: OriginType;


  // has filesystem metadata and associated placeholder panel on UI
  get isReadyForUpload(): boolean {
    return !!this.fileSize && !!this.panel;
  }

  constructor(name: string, origin: OriginType) {
    this.name = name;
    this.waitingTime = new Date();
    this.origin = origin;
  }
}



