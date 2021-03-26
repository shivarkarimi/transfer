import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, map, mergeMap, tap } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { randomColor } from 'randomcolor';
import { TransferService } from './transfer.service';
import { TransferType } from 'src/models/transfer-type';
import { TransferStatus } from 'src/models/transfer-status';
import { OriginType } from 'src/models/origin-type';

@Injectable({ providedIn: 'root' })
export class AssetDownloadService {

  constructor(private transferService: TransferService) { }

  public download(items: TransferItem[]): Observable<TransferItem> {


    return from(items)
      .pipe(
        mergeMap(() => this.downloadAsset(), (item, asset) => { return { item, asset } }),
        map(({ item, asset }) => {
          const downloadItem = this.createDownloadTransferItem(item)
          item.panel.color = asset;
          return downloadItem
        }),
        delay(1000),
        tap((item: TransferItem) => item.status = TransferStatus.DONE)
      )
  }

  private downloadAsset(): Observable<string> {
    return of(randomColor())
      .pipe(
        delay(Math.floor(Math.random() * 100))
      )
  }

  private createDownloadTransferItem(item: TransferItem): TransferItem {
    const downloadItem = new TransferItem(item.name, item.origin, TransferType.Download);
    downloadItem.fileSize = item.fileSize;
    downloadItem.status = TransferStatus.DOWNLOADING;
    this.transferService.add([downloadItem]);
    return downloadItem;
  }
}


