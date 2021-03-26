import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { PanelStatus } from 'src/models/panel-status';
import { TransferItem } from 'src/models/transfer-item';
import { TransferStatus } from 'src/models/transfer-status';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {

  public upload(queueItem: TransferItem): Observable<TransferItem> {
    return of(queueItem)
      .pipe(
        tap((qi: TransferItem) => {
          qi.status = TransferStatus.UPLOADING;
          qi.panel.status = PanelStatus.PROCESSING;
        }),
        delay(10),
        tap((qi: TransferItem) => {
          if (qi.fileSize > 35 && qi.fileSize < 80) {
            qi.status = TransferStatus.ERROR;
            qi.panel.status = PanelStatus.FAILED;
          }
          qi.panel.assetId = `${Math.floor(Math.random() * 100)}`
        }),
      )
  }
}


