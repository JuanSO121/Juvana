import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },         // Ruta para la página de inicio
  { path: 'room/:id', component: RoomComponent }, // Ruta con parámetro dinámico ':id'
  // Puedes añadir más rutas según sea necesario
];
