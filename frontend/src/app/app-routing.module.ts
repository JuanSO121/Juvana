import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { RoomListComponent } from './room-list/room-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'room/:id', component: RoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
