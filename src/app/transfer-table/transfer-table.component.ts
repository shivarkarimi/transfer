import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { Queue } from 'src/models/queue';
import { QueueItem } from 'src/models/queue-item';
import { EmptyPanelCreationService } from '../../services/empty-panel-creation.service';
import { FileImportService } from '../../services/file-import.service';

@Component({
  selector: 'app-transfer-table',
  templateUrl: './transfer-table.component.html',
  styleUrls: ['./transfer-table.component.scss']
})
export class TransferTableComponent implements OnInit, OnDestroy {

  public queue: Queue;
  public uploadQueue: Queue;
  private destroy: Subject<void> = new Subject<void>();

  constructor(private fileTransferService: FileImportService, private emptyPanelCreationService: EmptyPanelCreationService) { }

  public ngOnInit(): void {

    // this.fileTransferService.newItemsStream
    //   .subscribe(
    //     // concatMap((qi: QueueItem[]) => this.emptyPanelCreationService.createEmptyPanels(queue)),
    //   );


    // this.fileTransferService.ingestQueueStream
    //   .pipe(
    //     tap(queue => this.queue = queue),
    //     concatMap(queue => this.emptyPanelCreationService.createEmptyPanels(queue)),
    //     // concatMap(queue => this.queueItemFileSystemDataService.update(queue)),
    //     // concatMap(() => {

    //     //   if (this.checkNItemsIsReady(5)) {
    //     //     return this.fileTransferService.notify();
    //     //   } else {
    //     //     return of(this.queue);
    //     //   }
    //     // }),
    //     tap(q => this.uploadQueue = q),
    //     takeUntil(this.destroy)
    //   )
    //   .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
  }

  private checkNItemsIsReady(n: number): boolean {
    if (this.queue.size < n) {
      return this.queue.getItem(this.queue.size - 1).isReadyForUpload;
    }

    return this.queue.getItem(n - 1).isReadyForUpload;
  }

}
