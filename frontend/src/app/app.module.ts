import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de que existe app-routing.module.ts
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { ChatComponent } from './room/chat/chat.component';
import { RoomListComponent } from './room-list/room-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent,
    ChatComponent,
    RoomListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Asegúrate de que app-routing.module esté importado aquí
    RouterModule.forRoot([]) // Configura RouterModule aquí si no lo has hecho en AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
