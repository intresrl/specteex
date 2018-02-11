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
