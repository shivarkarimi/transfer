import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, flatMap, tap, toArray } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { randomColor } from 'randomcolor';
import { TransferStatus } from 'src/models/transfer-status';

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
  public import(items: TransferItem[]): Observable<TransferItem[]> {
    return of(items)
      .pipe(
        flatMap((items: TransferItem[]) => from(items)),
        tap((item: TransferItem) => item.panel.color = randomColor()),
        tap((item: TransferItem) => item.status = TransferStatus.DONE),
        toArray(),
        delay(100)
      )
  }

}
