import { Injectable } from '@angular/core';
import { EMPTY, from, fromEvent, interval, Observable, of, Subject, timer } from 'rxjs';
import { buffer, concatMap, debounce, delay, filter, flatMap, map, take, tap, toArray, bufferTime, finalize } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';
import { AssetUploadService } from './asset-upload.service';
import { BulkImportService } from './bulk-import.service';
import { FileSystemHelperService } from './file-system-helper.service';
import { ChangeNotifierService } from './change-notifier.service';

@Injectable({ providedIn: 'root' })
export class FileImportService {

  public importStream = new Subject<QueueItem>();
  isPaused: boolean = false;

  constructor(
    private fileSystemHelperService: FileSystemHelperService,
    private assetUploadService: AssetUploadService,
    private bulkImportService: BulkImportService
  ) { }

  public listenToImport(): Observable<QueueItem[]> {
    /**
     * TODO:
     * Update so that when
     * if there are more than 1 items => upload immediately
     * else set debounceTime to 5000
     */
    const debounceTime = 5000;

    /**
     * Note to debounce to work properly, should be Hot observable.
     * doing from() does not work!
     * So we have listening to subject
     */
    return this.importStream
      .pipe(
        flatMap((qi: QueueItem) => this.fileSystemHelperService.update(qi)),
        flatMap((qi: QueueItem) => (this.isPaused ? EMPTY : this.assetUploadService.upload(qi))),
        bufferTime(debounceTime),
        filter(x => (x && !!x.length)),
        map((qi) => [].concat(...qi)),
        concatMap((qi: QueueItem[]) => this.bulkImportService.import(qi)),
      )
  }
}


