import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { buffer, concatMap, filter, flatMap, map, tap } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';
import { OriginType } from "src/models/origin-type";
import { AssetUploadService } from './asset-upload.service';
import { BulkImportService } from './bulk-import.service';
import { FileSystemHelperService } from './file-system-helper.service';
import { TransferStatus } from 'src/models/transfer-status';

@Injectable({ providedIn: 'root' })
export class FileImportService {

  public importStream = new Subject<TransferItem>();
  public bufferByStream = new Subject<void>();
  public retryStream = new Subject<void>();

  isPaused: boolean = false;

  private interval: any;

  constructor(
    private fileSystemHelperService: FileSystemHelperService,
    private assetUploadService: AssetUploadService,
    private bulkImportService: BulkImportService
  ) { }

  public listenToImport(): Observable<TransferItem[]> {
    /**
     * Note: to debounce to work properly, should be Hot observable.
     * creating observable from() does not work!
     * So we have listening to subject
     */
    return this.importStream
      .pipe(
        flatMap((qi: TransferItem) => this.fileSystemHelperService.update(qi)),
        flatMap((qi: TransferItem) => (this.isPaused ? EMPTY : this.assetUploadService.upload(qi))),
        // tap((qi: TransferItem) => this.bufferByMovingInterval(qi)),
        tap((qi: TransferItem) => this.bufferByMaxInterval(qi)),
        buffer(this.bufferByStream.asObservable()),
        // tap(() => clearInterval(this.interval)),
        tap(() => this.resetBuffer()),
        filter(x => (x && !!x.length)),
        map((qi) => [].concat(...qi)),
        concatMap((qi: TransferItem[]) => this.bulkImportService.import(qi)),
      )
  }

  retry(item: TransferItem): void {
    item.status = TransferStatus.LOADED;
    this.importStream.next(item);
  }

  /**
   * Emits bufferByStream
   *
   * @param qi
   */
  private bufferByMovingInterval(qi: TransferItem) {
    const lastEmissionTime: Date = new Date();
    // cancel existing interval
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() - lastEmissionTime.getSeconds() > this.getSecondsToWait(qi)) {
        this.drain()
      }
    }, 100);
  }


  private firstEmission: boolean = true;
  private timeoutId: any;

  private bufferByMaxInterval(qi: TransferItem) {
    if (this.firstEmission) {
      this.firstEmission = false;
      this.timeoutId = setTimeout(() => {
        this.drain();
        console.log('%c Draining', 'background:#271cbb; color: #dc52fa', performance.now())
      }, this.getSecondsToWait(qi) * 1000);
    }

  }

  private drain(): void {
    this.bufferByStream.next();
  }

  private resetBuffer(): void {
    clearInterval(this.timeoutId);
    this.firstEmission = true;
  }


  private getSecondsToWait(qi: TransferItem): number {
    let secondsToWait: number = 0;

    switch (qi.origin) {
      case OriginType.PHOTOSHOP:
        secondsToWait = 4;
        break;

      case OriginType.MANUAL:
        secondsToWait = 5;
        break;

      default:
        secondsToWait = 2;
        break;
    }

    return secondsToWait;
  }
}


