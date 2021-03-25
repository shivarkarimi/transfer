import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TransferItem } from 'src/models/transfer-item';

@Injectable({ providedIn: 'root' })
export class FileSystemHelperService {

  public update(items: TransferItem): Observable<TransferItem> {
    return of(items)
      .pipe(
        // Only update if fileSize is not update before
        map((item: TransferItem) => {
          if (!item.fileSize) {
            item.fileSize = this.getSize();
          } else {
            this.resizeForRetry(item)
          }
          return item
        }),
        delay(100),
      )
  }

  private getSize(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  /**
   * For Mock ONLY
   * @param item
   */
  private resizeForRetry(item: TransferItem) {
    item.fileSize = 100;
  }

}
