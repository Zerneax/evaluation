import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './pages/welcome/welcome.module';
import { ClasseModule } from './pages/classe/classe.module';
import { VisualiserModule } from './pages/visualiser/visualiser.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WelcomeModule,
    ClasseModule,
    VisualiserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
