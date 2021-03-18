import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, flatMap, tap, toArray } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';
import { randomColor } from 'randomcolor';


@Injectable({ providedIn: 'root' })
export class BulkImportService {

  /**
   * This will Include:
   *  HTTP bulk transcode
   *  HTTP bulk panel create
   *  Bulk checksum
   * @param items
   * @returns
   */
  public import(items: QueueItem[]): Observable<QueueItem[]> {
    return of(items)
      .pipe(
        flatMap((items: QueueItem[]) => from(items)),
        tap((item: QueueItem) => item.panel.color = randomColor()),
        toArray(),
        delay(100)
      )
  }

}
