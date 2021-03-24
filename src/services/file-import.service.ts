import { Injectable } from '@angular/core';
import { EMPTY, from, fromEvent, interval, Observable, of, Subject, timer } from 'rxjs';
import { buffer, concatMap, debounce, delay, filter, flatMap, map, take, tap, toArray, bufferTime, finalize } from 'rxjs/operators';
import { OriginType, QueueItem } from 'src/models/queue-item';
import { AssetUploadService } from './asset-upload.service';
import { BulkImportService } from './bulk-import.service';
import { FileSystemHelperService } from './file-system-helper.service';
import { ChangeNotifierService } from './change-notifier.service';

@Injectable({ providedIn: 'root' })
export class FileImportService {

  public importStream = new Subject<QueueItem>();
  public bufferByStream = new Subject<void>();
  isPaused: boolean = false;

  private interval: any;

  constructor(
    private fileSystemHelperService: FileSystemHelperService,
    private assetUploadService: AssetUploadService,
    private bulkImportService: BulkImportService
  ) { }

  public listenToImport(): Observable<QueueItem[]> {
    /**
     * Note: to debounce to work properly, should be Hot observable.
     * creating observable from() does not work!
     * So we have listening to subject
     */
    return this.importStream
      .pipe(
        flatMap((qi: QueueItem) => this.fileSystemHelperService.update(qi)),
        flatMap((qi: QueueItem) => (this.isPaused ? EMPTY : this.assetUploadService.upload(qi))),
        tap((qi: QueueItem) => this.bufferBy(qi)),
        //bufferTime(debounceTime),
        buffer(this.bufferByStream.asObservable()),
        tap(() => clearInterval(this.interval)),
        tap(x => console.log('%c xxx', 'background:#271cbb; color: #dc52fa', x)),
        filter(x => (x && !!x.length)),
        map((qi) => [].concat(...qi)),
        concatMap((qi: QueueItem[]) => this.bulkImportService.import(qi)),
      )
  }

  /**
   * Emits bufferByStream
   *
   * @param qi
   */
  private bufferBy(qi: QueueItem) {
    console.log('%c buffer by called', 'background:#271cbb; color: #dc52fa',)
    const lastEmissionTime: Date = new Date();
    // cancel existing interval
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() - lastEmissionTime.getSeconds() > this.setSecondsToWait(qi)) {
        this.bufferByStream.next();
      }
    }, 100);
  }

  private setSecondsToWait(qi: QueueItem): number {
    let secondsToWait: number = 0;

    switch (qi.origin) {
      case OriginType.PHOTOSHOP:
        secondsToWait = 4;
        break;

      case OriginType.MANUAL:
        secondsToWait = 2;
        break;

      default:
        secondsToWait = 2;
        break;
    }

    return secondsToWait;
  }
}


