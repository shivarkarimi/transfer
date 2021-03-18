import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueItem } from 'src/models/queue-item';
import { FileImportService } from 'src/services/file-import.service';
import { IngestQueueService } from 'src/services/ingest-queue.service';

@Component({
  selector: 'app-transfer-table',
  templateUrl: './transfer-table.component.html',
  styleUrls: ['./transfer-table.component.scss']
})
export class TransferTableComponent implements OnInit, OnDestroy {

  public ingestQueue: QueueItem[];
  private destroy: Subject<void> = new Subject<void>();

  constructor(private fileImportService: FileImportService, private ingestQueueService: IngestQueueService) { }

  public ngOnInit(): void {
    this.ingestQueueService.ingestQueueStream
      .subscribe(
        x => this.ingestQueue = x
      );

    this.fileImportService.listenToImport()
      .subscribe(
        x => console.log('%c IMPORT UPDATE', 'background:#271cbb; color: #dc52fa', x)
      );
  }

  public ngOnDestroy(): void {
    this.destroy.next();
  }



}
