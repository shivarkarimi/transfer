import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class BulkImportService {

  public import(items: QueueItem[]): Observable<QueueItem[]> {
    return of(items)
      .pipe(
        delay(100)
      )
  }

}
