// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface WebSocketMessage {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private subject!: Subject<WebSocketMessage>;

  public connect(url: string): Subject<WebSocketMessage> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url: string): Subject<WebSocketMessage> {
    let ws = new WebSocket(url);

    let observable = new Observable<WebSocketMessage>((obs) => {
      ws.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        obs.next(message);
      };
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    let observer = {
      next: (data: WebSocketMessage) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }

  
}
