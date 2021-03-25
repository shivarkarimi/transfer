import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { TransferStatus } from 'src/models/transfer-status';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {

  public upload(queueItem: TransferItem): Observable<TransferItem> {
    return of(queueItem)
      .pipe(
        tap((x) => console.log('%c Asset', 'background:#271cbb; color: #dc52fa', x)),
        tap((qi: TransferItem) => qi.status = TransferStatus.UPLOADING),
        delay(10),
        tap((qi: TransferItem) => {
          if (qi.fileSize > 35 && qi.fileSize < 80) {
            qi.status = TransferStatus.ERROR
          }
          qi.panel.assetId = `${Math.floor(Math.random() * 100)}`
        }),
      )
  }
}


