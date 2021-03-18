import { Panel } from './panel';
import { ReplaySubject } from 'rxjs';
import { TransferType } from './TransferType';

export interface TransferItem {
  type: TransferType;
  createdDate: Date;
  finishDate: Date;
  progress: number;
  bytesWritten: number;
  onErrorEvent: ReplaySubject<Error>;
  uploadPath: string;
  showID: number;
  ref: any;
  asset: any;
  panels: Panel[];
  assetCreated: boolean;
}
