/*
 * Copyright (C)  2018  Gianni Bombelli & Emanuele Mantovani @ Intré S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BoardComponent} from './component/board/board.component';
import {ChatComponent} from './component/chat/chat.component';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {DataService} from './service/data.service';
import {WebSocketService} from './service/websocket.service';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomErrorStateMatcher} from './service/form.service';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {BoardBlockComponent} from './component/board-block/board-block.component';
import {StatusService} from './service/status.service';
import {DisableControlDirective} from './directive/disable-control.directive';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardBlockComponent,
    ChatComponent,
    HomeComponent,
    LoginComponent,
    SidebarComponent,
    DisableControlDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CustomErrorStateMatcher,
    DataService,
    StatusService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
