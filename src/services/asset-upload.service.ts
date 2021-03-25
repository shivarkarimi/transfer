import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';
import { QueueStatus } from 'src/models/queue-status';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {

  public upload(queueItems: QueueItem): Observable<QueueItem> {
    return of(queueItems)
      .pipe(
        tap((qi: QueueItem) => qi.status = QueueStatus.UPLOADING),
        delay(10),
        tap((qi: QueueItem) => qi.panel.assetId = `${Math.floor(Math.random() * 100)}`),
        tap((qi: QueueItem) => qi.status = QueueStatus.DONE),
      )
  }
}


