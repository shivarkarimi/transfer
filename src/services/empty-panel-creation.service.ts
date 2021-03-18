import { Injectable } from '@angular/core';
import { concat, from, Observable, Subject } from 'rxjs';
import { delay, map, take, tap, toArray } from 'rxjs/operators';
import { Panel } from 'src/models/panel';
import { Queue } from 'src/models/queue';
import { QueueItem } from 'src/models/queue-item';

@Injectable({ providedIn: 'root' })
export class EmptyPanelCreationService {

  // Only for display immediately on screen
  public panelsStream: Subject<Panel[]> = new Subject<Panel[]>();

  private queueCounter: number = 0;
  private sequencePanels: Panel[] = [];

  public createEmptyPanels(queueItems: Queue): Observable<any> {
    const queueId = this.queueCounter++;
    return concat(queueItems)
      .pipe(
        // tap((queueItem: QueueItem) =>
        //   queueItem.panel = this.buildLocalPanel(queueItems.getIndex(queueItem), queueId, queueItem.fileName)),
        tap((queueItem: QueueItem) => queueItem.panel = this.buildLocalPanel(0, queueId, queueItem.name)),
        // tap((queueItem: QueueItem[]) => this.addPanelsToSequence(queueItem)),
        tap((queueItem: QueueItem) => this.addPanelsToSequence(queueItem)),
        toArray(),
        take(1),
        tap(() => this.panelsStream.next(this.sequencePanels))
        // map(() => queueItems),
      );
  }


  buildLocalPanel(index, foo, name): Panel {
    return {
      id: null,
      queueIndex: index,
      queueId: foo,
      fileName: name,
      color: ''
    };
  }

  // addPanelsToSequence(queueItem: QueueItem[]): void {
  //   queueItem.forEach(qi => this.sequencePanels.push(qi.panel));
  //   this.panelsStream.next(this.sequencePanels);
  // }
  addPanelsToSequence(queueItem: QueueItem): void {
    // queueItem.forEach(qi => this.sequencePanels.push(qi.panel));
    // this.panelsStream.next(this.sequencePanels);
    this.sequencePanels.push(queueItem.panel)
  }

}
