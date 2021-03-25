import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Panel } from 'src/models/panel';
import { PanelStatus } from 'src/models/panel-status';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class PanelService {

  // Only for display immediately on screen
  public panelsStream: Subject<Panel[]> = new Subject<Panel[]>();

  public sequencePanels: Panel[] = [];
  private listCounter: number = 0;

  public createEmptyPanels(ingestList: QueueItem[]): void {
    const listId = this.listCounter++;

    ingestList.forEach((qi, index) => {
      const panel = this.buildLocalPanel(index, qi.name, listId);
      qi.panel = panel;

      // Just for the UI
      this.sequencePanels.push(panel)
    });

    this.addPanelsToSequence();

  }

  buildLocalPanel(index, name, queueId): Panel {
    return {
      id: null,
      queueIndex: index,
      queueId: queueId,
      fileName: name,
      color: '',
      assetId: null,
      status: PanelStatus.PROCESSING
    };
  }

  addPanelsToSequence(): void {
    this.panelsStream.next(this.sequencePanels);
  }

}
