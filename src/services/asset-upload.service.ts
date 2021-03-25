import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { TransferStatus } from 'src/models/transfer-status';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {

  public upload(queueItems: TransferItem): Observable<TransferItem> {
    return of(queueItems)
      .pipe(
        tap((qi: TransferItem) => qi.status = TransferStatus.UPLOADING),
        delay(10),
        tap((qi: TransferItem) => qi.panel.assetId = `${Math.floor(Math.random() * 100)}`),
        tap((qi: TransferItem) => qi.status = TransferStatus.UPLOADING),
      )
  }
}


