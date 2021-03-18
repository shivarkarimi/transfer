import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { TransferTableComponent } from './transfer-table/transfer-table.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    TransferTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
