import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {

  public upload(queueItems: QueueItem): Observable<QueueItem> {
    return of(queueItems)
      .pipe(
        delay(10),
        tap((qi: QueueItem) => qi.panel.assetId = 'AssetID')
      )
  }
}


