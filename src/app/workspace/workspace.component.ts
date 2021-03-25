import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, flatMap, takeUntil, tap } from 'rxjs/operators';
import { Panel } from 'src/models/panel';
import { TransferItem } from 'src/models/transfer-item';
import { OriginType } from "src/models/origin-type";
import { ConnectionMonitorService } from 'src/services/connection-monitor.service';
import { FileImportService } from 'src/services/file-import.service';
import { PanelService } from 'src/services/panel.service';
import { IngestQueueService } from 'src/services/ingest-queue.service';
import { ChangeNotifierService } from 'src/services/change-notifier.service';
import { TransferService } from 'src/services/transfer.service';
import { TransferStatus } from 'src/models/transfer-status';
import { generateFileNameList } from './generate-file-name-list';

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
 *
 *
 * Define definition of DONE
 *
 */

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  panels: Panel[] = [];

  // to display on UI only
  isImportPaused: boolean = false;

  // internet/vpn connection disruption or manual pause

  private destroy: Subject<void> = new Subject<void>();
  clicks: number = 0;

  constructor(
    public zone: NgZone,
    private fileImportService: FileImportService,
    private panelService: PanelService,
    private connectionMonitorService: ConnectionMonitorService,
    private IngestQueueService: IngestQueueService,
    private changeNotifierService: ChangeNotifierService,
    private transferService: TransferService

  ) { }


  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngOnInit(): void {

    this.isImportPaused = this.connectionMonitorService.isImportPaused;

    this.changeNotifierService.changeStream
      .subscribe(() => {
        this.zone.run(() => { this.panels = this.panelService.sequencePanels })
      });

    this.panelService.panelsStream
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(x => this.panels = x);

    // When un-pausing try to import again
    // TODO: Move to FileImportService
    this.connectionMonitorService.pauseChangeStream
      .pipe(
        tap(x => this.isImportPaused = x),
        filter(x => !x),
        tap(() => {
          if (this.IngestQueueService.ingestList.length) {
            this.IngestQueueService.ingestList.forEach(x => this.fileImportService.importStream.next(x));
            this.IngestQueueService.emptyList();
          }
        })
      )
      .subscribe();

    // Add retry to ingest list
    // TODO: Move to FileImportService
    this.fileImportService.retryStream
      .pipe(
        tap(() => {
          if (!this.connectionMonitorService.isImportPaused) {
            this.IngestQueueService.ingestList.forEach(x => {
              if (x.status === TransferStatus.RETRY) {
                this.fileImportService.importStream.next(x);
                this.IngestQueueService.emptyList();
              }
            });
          }
        })
      ).subscribe()
  }

  // TODO: Move to FileImportService
  public importFile(total: number, supported: boolean = true): void {
    this.clicks++;
    const newItems = this.IngestQueueService.createQueueItems(generateFileNameList(total), OriginType.MANUAL, supported);

    // synchronously add panels to workspace
    this.panelService.createEmptyPanels(newItems);

    // Add new QueueItems to the list
    this.IngestQueueService.addItems(newItems);
    this.transferService.add(this.IngestQueueService.ingestList);


    // emit ingest list into stream
    if (!this.connectionMonitorService.isImportPaused) {
      this.IngestQueueService.ingestList.forEach(x => {
        if (x.status !== TransferStatus.UNSUPPORTED)
          this.fileImportService.importStream.next(x);
      });
      this.IngestQueueService.emptyList();
    }
  }

  public pauseImport() {
    this.connectionMonitorService.pause();
  }

}


