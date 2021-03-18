import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';

/**
 *  This service checks Internet and VPN health check
 *  Or Manual pause by the use
 */
@Injectable({ providedIn: 'root' })
export class ConnectionMonitorService {

  pauseChangeStream: Subject<boolean> = new Subject<boolean>();

  isPaused: boolean = false;

  public pause(): void {
    this.pauseChangeStream.next(!this.isPaused);
  }

}
