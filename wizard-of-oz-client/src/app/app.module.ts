import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {MaterialModule} from './module/material.modules';
import {BoardComponent} from './component/board/board.component';
import {ChatComponent} from './component/chat/chat.component';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {DataService} from './service/data.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ChatComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
