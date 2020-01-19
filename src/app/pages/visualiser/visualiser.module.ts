import { VisualiserComponent } from './visualiser.component';
import { NgModule } from '@angular/core';
import { RetourModule } from '../global/retour/retour.module';

@NgModule({
  declarations: [
    VisualiserComponent
  ],
  imports: [
    RetourModule
  ],
  providers: [],
  exports: [VisualiserComponent]
})
export class VisualiserModule { }
