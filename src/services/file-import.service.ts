import { Injectable } from '@angular/core';
import { EMPTY, from, interval, Observable, of } from 'rxjs';
import { buffer, concatMap, debounce, delay, filter, flatMap, map, take, tap, toArray } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';
import { AssetUploadService } from './asset-upload.service';
import { BulkImportService } from './bulk-import.service';
import { FileSystemHelperService } from './file-system-helper.service';

@Injectable({ providedIn: 'root' })
export class FileImportService {

  private debounceBucket: QueueItem[] = [];

  constructor(
    private fileSystemHelperService: FileSystemHelperService,
    private assetUploadService: AssetUploadService,
    private bulkImportService: BulkImportService) { }

  public import(queueItems: QueueItem[], isPaused: boolean): Observable<any> {

    return from(queueItems)
      .pipe(
        flatMap((qi: QueueItem) => this.fileSystemHelperService.update(qi)),
        flatMap((qi: QueueItem) => (isPaused ? EMPTY : this.assetUploadService.upload(qi))),
        filter(Boolean),
        take(queueItems.length),
        toArray(),
        flatMap((qi: QueueItem[]) => this.debounce(qi)),
        concatMap((qi: QueueItem[]) => this.bulkImportService.import(qi)),
        take(1),
        tap(() => this.debounceBucket = [])
      )
  }

  /**
   * if the size of queueItems is more than 1 don't wait
   * if the size is 1 wait 1000ms
   */

  private debounce(queueItems: QueueItem[]): Observable<QueueItem[]> {
    let bufferTime = (queueItems.length > 1) ? 0 : 1000;
    const bufferBy = interval(bufferTime);

    return of(queueItems)
      .pipe(
        buffer(bufferBy),
        map((qi: QueueItem[][]) => [].concat(...qi))
      )


  }
}


