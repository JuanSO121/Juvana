// src/app/room/room.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService, WebSocketMessage } from '../services/websocket.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  room: string = '';
  messages: string[] = [];
  private socket$!: Subject<WebSocketMessage>;

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.paramMap.get('room') || '';
    console.log(`Connecting to WebSocket for room: ${this.room}`);
    this.connectToWebSocket();
  }
  

  connectToWebSocket(): void {
    this.socket$ = this.websocketService.connect(`ws://localhost:3000/ws/room/${this.room}`);
    this.socket$.subscribe(
      (message: WebSocketMessage) => this.onMessage(message),
      (err) => console.error(err),
      () => console.log('complete')
    );
  }

  onMessage(message: WebSocketMessage): void {
    this.messages.push(JSON.stringify(message));
    // Handle the message as needed
  }

  sendMessage(content: string): void {
    const message: WebSocketMessage = { type: 'SEND_MESSAGE', data: content };
    this.socket$.next(message);
  }
}
