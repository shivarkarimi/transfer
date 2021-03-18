import { QueueItem } from './queue-item';

export class Queue implements Iterable<QueueItem> {

  private items: Array<QueueItem> = [];

  public getIndex(item: QueueItem): number {
    return this.items.indexOf(item);
  }

  public get size(): number {
    return this.items.length;
  }

  public get isEmpty(): boolean {
    return !this.items.length;
  }

  public enqueue(qi: QueueItem[]): number {
    this.items.splice(this.items.length, 0, ...qi);
    return this.items.length;
  }

  public dequeue(n: number = 1): QueueItem[] {
    return this.items.splice(0, n);
  }

  public dequeueAll(predicate: Function = null): QueueItem[] {
    const returnValue: QueueItem[] = [];
    const remainder: QueueItem[] = [];

    if (!predicate) {
      const curr = this.items;
      this.items = [];
      return curr;
    }

    for (const curr of this.items) {
      if (predicate(curr)) {
        returnValue.push(curr);
      } else {
        remainder.push(curr);
      }
    }
    this.items = remainder;
    return returnValue;
  }

  public getItem(index: number): QueueItem {
    return this.items[index];
  }

  public remove(index: number): number {
    this.items = this.items.splice(index, 1);
    return this.items.length;
  }

  public empty(): boolean {
    this.items = [];
    return true;
  }

  public chunk(chunk: number): QueueItem[][] {
    if (!chunk || !this.items.length) {
      return [];
    }

    const result: QueueItem[][] = [];
    for (let i: number = 0; i < this.items.length; i += chunk) {
      result.push(this.items.slice(i, i + chunk));
    }
    return result;
  }

  public *[Symbol.iterator](): IterableIterator<QueueItem> {
    for (const i of this.items) {
      yield i;
    }
  }

}





