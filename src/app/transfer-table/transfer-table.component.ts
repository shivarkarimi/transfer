import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OriginType } from 'src/models/origin-type';
import { TransferItem } from 'src/models/transfer-item';
import { TransferStatus } from 'src/models/transfer-status';
import { TransferType } from 'src/models/transfer-type';
import { ChangeNotifierService } from 'src/services/change-notifier.service';
import { FileImportService } from 'src/services/file-import.service';
import { IngestQueueService } from 'src/services/ingest-queue.service';
import { TransferService } from 'src/services/transfer.service';

@Component({
  selector: 'app-transfer-table',
  templateUrl: './transfer-table.component.html',
  styleUrls: ['./transfer-table.component.scss']
})
export class TransferTableComponent implements OnInit, OnDestroy {

  public transferUI: Set<TransferItem> = new Set();
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    public zone: NgZone,
    private fileImportService: FileImportService,
    private changeNotifierService: ChangeNotifierService,
    private TransferService: TransferService,
    private ingestQueueService: IngestQueueService
  ) { }


  public ngOnDestroy(): void {
    this.destroy.next();
  }

  public ngOnInit(): void {
    this.changeNotifierService.changeStream
      .subscribe(() => {
        this.zone.run(() => { this.transferUI = this.TransferService.transferList })
      });

    this.TransferService.transferStream
      .subscribe(
        x => {
          this.transferUI = x
        }
      );

    this.fileImportService.listenToImport()
      .subscribe(
        () => {
          this.changeNotifierService.notify();
        }
      );
  }

  public getStatus(s: number): string {
    return TransferStatus[s].toString();
  }

  public getOrigin(s: number): string {
    return OriginType[s].toString();
  }

  public getTransferType(s: number): string {
    return s ? '&#8595;' : '&#8593;';
  }

  public remove(item: TransferItem): void {
    this.TransferService.remove(item);
  }

  public retry(item: TransferItem): void {
    item.status = TransferStatus.RETRY;
    this.ingestQueueService.addItems([item]);
    this.fileImportService.retryStream.next();
  }

}
