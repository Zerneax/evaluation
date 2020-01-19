import { WelcomeComponent } from './welcome.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    RouterModule
  ],
  providers: [],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
