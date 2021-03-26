import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, filter, flatMap, tap, toArray } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { randomColor } from 'randomcolor';
import { TransferStatus } from 'src/models/transfer-status';
import { PanelStatus } from 'src/models/panel-status';
import { AssetDownloadService } from './asset-download.service';

@Injectable({ providedIn: 'root' })
export class BulkImportService {

  constructor(private assetDownloadService: AssetDownloadService) { }

  /**
   * This will Include:
   *  HTTP bulk transcode
   *  HTTP bulk panel create
   *  Bulk checksum
   * @param items
   * @returns
   */
  public import(items: TransferItem[]): Observable<TransferItem> {
    return of(items)
      .pipe(
        flatMap((items: TransferItem[]) => from(items)),
        filter((item: TransferItem) => item.status !== TransferStatus.ERROR),
        // tap((item: TransferItem) => item.panel.color = randomColor()),
        tap((item: TransferItem) => item.status = TransferStatus.DONE),
        tap((item: TransferItem) => item.panel.status = PanelStatus.SUCCESS),
        toArray(),
        tap(x => console.log('%c Bulk Upload', 'background:#271cbb; color: #dc52fa', x)),
        flatMap((items: TransferItem[]) => this.assetDownloadService.download(items)),
        delay(50)
      )
  }

}
