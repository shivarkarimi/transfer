import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';

@Injectable({ providedIn: 'root' })
export class FileSystemHelperService {

  public update(items: TransferItem): Observable<TransferItem> {
    return of(items)
      .pipe(
        // Only update if fileSize is not update before
        filter((item: TransferItem) => !item.fileSize),
        delay(100),
        tap((item: TransferItem) => item.fileSize = 250)
      )
  }

}
