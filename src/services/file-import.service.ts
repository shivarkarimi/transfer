import { Injectable } from '@angular/core';
import { EMPTY, from, fromEvent, interval, Observable, of, Subject, timer } from 'rxjs';
import { buffer, concatMap, debounce, delay, filter, flatMap, map, take, tap, toArray, bufferTime } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';
import { AssetUploadService } from './asset-upload.service';
import { BulkImportService } from './bulk-import.service';
import { FileSystemHelperService } from './file-system-helper.service';

@Injectable({ providedIn: 'root' })
export class FileImportService {

  public importStream = new Subject<QueueItem>();
  isPaused: boolean = false;

  constructor(
    private fileSystemHelperService: FileSystemHelperService,
    private assetUploadService: AssetUploadService,
    private bulkImportService: BulkImportService) { }

  public listenToImport(): Observable<any> {
    const debounceTime = 5000;

    return this.importStream
      .pipe(
        flatMap((qi: QueueItem) => this.fileSystemHelperService.update(qi)),
        flatMap((qi: QueueItem) => (this.isPaused ? EMPTY : this.assetUploadService.upload(qi))),
        bufferTime(debounceTime),
        map((qi) => [].concat(...qi)),
        concatMap((qi: QueueItem[]) => this.bulkImportService.import(qi)),
      )
  }
}


