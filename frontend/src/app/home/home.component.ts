import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string = '';
  selectedRoom: string = '';
  rooms: string[] = []; // Supón que tienes una lista de salas

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicializa la lista de salas
    this.rooms = ['Room1', 'Room2', 'Room3'];
  }

  enterRoom(): void {
    if (this.userName && this.selectedRoom) {
      this.router.navigate(['/room', this.selectedRoom], { queryParams: { userName: this.userName } });
    }
  }
}
