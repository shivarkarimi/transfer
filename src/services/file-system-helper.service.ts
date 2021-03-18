import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class FileSystemHelperService {

  public update(items: QueueItem): Observable<QueueItem> {
    return of(items)
      .pipe(
        // Only update if fileSize is not update before
        filter((item: QueueItem) => !item.fileSize),
        delay(100),
        tap((item: QueueItem) => item.fileSize = 250)
      )
  }

}
