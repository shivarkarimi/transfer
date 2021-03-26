import { TransferItem } from './transfer-item';
/**
 * UNUSED - Delete
 */
export class Queue implements Iterable<TransferItem> {

  private items: Array<TransferItem> = [];

  public getIndex(item: TransferItem): number {
    return this.items.indexOf(item);
  }

  public get size(): number {
    return this.items.length;
  }

  public get isEmpty(): boolean {
    return !this.items.length;
  }

  public enqueue(qi: TransferItem[]): number {
    this.items.splice(this.items.length, 0, ...qi);
    return this.items.length;
  }

  public dequeue(n: number = 1): TransferItem[] {
    return this.items.splice(0, n);
  }

  public dequeueAll(predicate: Function = null): TransferItem[] {
    const returnValue: TransferItem[] = [];
    const remainder: TransferItem[] = [];

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

  public getItem(index: number): TransferItem {
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

  public chunk(chunk: number): TransferItem[][] {
    if (!chunk || !this.items.length) {
      return [];
    }

    const result: TransferItem[][] = [];
    for (let i: number = 0; i < this.items.length; i += chunk) {
      result.push(this.items.slice(i, i + chunk));
    }
    return result;
  }

  public *[Symbol.iterator](): IterableIterator<TransferItem> {
    for (const i of this.items) {
      yield i;
    }
  }

}





