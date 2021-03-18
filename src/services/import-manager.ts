import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Queue } from 'src/models/queue';
import { QueueItem } from 'src/models/queue-item';
import { QueueStatus } from 'src/models/queue-status';


/**
 * Notes:
 *  - importing fast one after another must maintain the order of files coming in.
 *  - the reason we are making the panel creation async is to keep the application responsive with large imports
 *  - if app crashes musn't lose state
 *  - without the network, the upload pauses
 *  - every loop has a pause check, and stops if paused
 *  - to resume from a paused state: go through everything in the list; if has panel and filesize, dequeue and send to next step
 *  - if an upload fails, then must offer a retry option for that file, display error error thumbnail in the panel
 *    - if user clicks on the retry button should add to the ingest list
 *
 *
 *  0 - Create UI list - includes download and uploads
 *  1 - synchronous add to ingest list
 *  2 - synchronous disable user workspace panel re-ordering/save
 *  3a - sync loop in-order creation of panels, yielding to application to maintain responsiveness, re-enable user workspace panel reordering/save when done (it's doing sync already)
 *  3b - async concurrent filesystem reading for every file
 *  4 - AppHelper:
 *      If paused:
 *      If unpaused:
 *      When an uploadItem has 1. a panel, 2. filesystem information, 3. checksum check (not a dupe):
 *      (if any of these steps errors due to the network, then put the associated uploaditems in an error state, and do not retry - revisit this when we have more information on how the server handles failure)
 *      - stateful debounce of this whole thing:
 *        - blocking async concurrent checksum check for every file
 *        - concurrent
 *          - send to the AppHelper (this gives us the asset id)
 *          - HTTP bulk panel creation: bulk panel creation requests to the server (this gives us the panel IDs)
 *        - HTTP bulk transcode request: batch bulk panel creation requests to the server (needs to wait for the apphelper and bulk panel creation to give us the assetID)
 *        - remove item from the list
 *  5 - Things can go wrong in any 3 concurrent panel/asset creation steps. Server should handle it.
 */

@Injectable({ providedIn: 'root' })
export class ImportManager {

  public upload(transferQueue: Queue): Observable<any> {

    // Immdesiately empty 5 from

    return from(transferQueue)
      .pipe(
        tap((qi: QueueItem) => qi.status = QueueStatus.UPLOADING)
      );
  }
}
