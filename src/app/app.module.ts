import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AgentsTableComponent } from './agents-table/agents-table.component';
import { SortByDateAscendingPipe } from './sort-by-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AgentsTableComponent,
    SortByDateAscendingPipe
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
