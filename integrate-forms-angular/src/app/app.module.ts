import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FlwformComponent } from './flwform/flwform.component';
import { FlowableApiService } from './flwapi/FlowableApiService';

@NgModule({
  declarations: [
    AppComponent,
    FlwformComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    FlowableApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
