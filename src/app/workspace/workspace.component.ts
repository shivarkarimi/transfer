import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, flatMap, takeUntil } from 'rxjs/operators';
import { Panel } from 'src/models/panel';
import { QueueItem } from 'src/models/queue-item';
import { ConnectionMonitorService } from 'src/services/connection-monitor.service';
import { FileImportService } from 'src/services/file-import.service';
import { PanelService } from 'src/services/panel.service';
import { IngestQueueService } from 'src/services/ingest-queue.service';

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

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  panels: Panel[] = [];
  // is UI busy
  isWorkspaceDisabled: boolean = false;

  // internet/vpn connection disruption or manual pause
  paused: boolean = false;

  private destroy: Subject<void> = new Subject<void>();
  ingestList: QueueItem[] = [];
  clicks: number = 0;

  constructor(
    private fileImportService: FileImportService,
    private panelService: PanelService,
    private connectionMonitorService: ConnectionMonitorService,
    private IngestQueueService: IngestQueueService
  ) { }


  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngOnInit(): void {
    this.panelService.panelsStream
      .subscribe(x => this.panels = x);


    // When un-pausing try to import again
    // this.connectionMonitorService.pauseChangeStream
    //   .pipe(
    //     filter(x => !x),
    //     flatMap(() => this.fileImportService.listenToImport(this.ingestList, this.paused))
    //   )
    //   .subscribe();
  }

  importFile(): void {
    this.clicks++;
    // Should not be able to Import when workspace is disabled (?)
    if (this.isWorkspaceDisabled) {
      return
    }

    const fileNames = [`${0}-${generateFileName()}`];
    this.ingestList = this.IngestQueueService.createQueueItems(fileNames);

    // synchronously add panels to workspace
    this.panelService.createEmptyPanels(this.ingestList);

    this.ingestList.forEach(x => this.fileImportService.importStream.next(x));
  }


}

const generateFileName = () => Math.random().toString(36).substring(7)
