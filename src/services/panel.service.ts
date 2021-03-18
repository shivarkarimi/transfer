import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Panel } from 'src/models/panel';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class PanelService {

  // Only for display immediately on screen
  public panelsStream: Subject<Panel[]> = new Subject<Panel[]>();

  private sequencePanels: Panel[] = [];
  private listCounter: number = 0;

  public createEmptyPanels(items: QueueItem[]): void {
    const listId = this.listCounter++;

    items.forEach((qi, index) => {
      const panel = this.buildLocalPanel(index, qi.name, listId);
      qi.panel = panel;
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
      assetId: null
    };
  }

  addPanelsToSequence(): void {
    this.panelsStream.next(this.sequencePanels);
  }

}
