import { Injectable } from '@angular/core';
import { Queue } from 'src/models/queue';
import { QueueItem } from 'src/models/queue-item';
import { ImportManager } from './import-manager';

@Injectable({ providedIn: 'root' })
export class FileImportService {
  private ingestQueue: Queue = new Queue();

  constructor() { }

  public import(filePaths: string[]): void {
    const items = filePaths.map(i => new QueueItem(i));
    this.ingestQueue.enqueue(items);
  }
}


