import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, flatMap, takeUntil } from 'rxjs/operators';
import { Panel } from 'src/models/panel';
import { QueueItem } from 'src/models/queue-item';
import { ConnectionMonitorService } from 'src/services/connection-monitor.service';
import { FileImportService } from 'src/services/file-import.service';
import { PanelService } from 'src/services/panel.service';

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
  queueItems: QueueItem[] = [];

  constructor(
    private fileImportService: FileImportService,
    private panelService: PanelService,
    private connectionMonitorService: ConnectionMonitorService
  ) { }


  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngOnInit(): void {
    this.panelService.panelsStream
      .subscribe(x => this.panels = x);


    // When un-pausing try to import again
    this.connectionMonitorService.pauseChangeStream
      .pipe(
        filter(x => !x),
        flatMap(() => this.fileImportService.import(this.queueItems, this.paused))
      )
      .subscribe();
  }

  importFile(): void {
    // Should not be able to Import when workspace is disabled (?)
    if (this.isWorkspaceDisabled) {
      return
    }

    const fileNames = [`${0}-${generateFileName()}`];
    this.queueItems = this.createQueueItems(fileNames);


    // synchronously add panels to workspace
    this.panelService.createEmptyPanels(this.queueItems);

    // async import starts here
    this.fileImportService.import(this.queueItems, this.paused)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe()
  }

  // Move to QueueItem Service
  createQueueItems(files: string[]): QueueItem[] {

    // TODO should filter files are that are exactly the same - with Set()
    return files.map(f => new QueueItem(f));
  }

}

const generateFileName = () => Math.random().toString(36).substring(7)
