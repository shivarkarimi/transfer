import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';

/**
 *  This service checks Internet and VPN health check
 *  Or Manual pause by the use
 */
@Injectable({ providedIn: 'root' })
export class ConnectionMonitorService {

  pauseChangeStream: Subject<boolean> = new Subject<boolean>();

  isImportPaused: boolean = false;

  public pause(): void {
    this.isImportPaused = !this.isImportPaused
    this.pauseChangeStream.next(this.isImportPaused);
  }

}
