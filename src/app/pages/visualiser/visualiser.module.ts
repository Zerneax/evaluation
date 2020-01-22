import { VisualiserComponent } from './visualiser.component';
import { NgModule } from '@angular/core';
import { RetourModule } from '../global/retour/retour.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    VisualiserComponent
  ],
  imports: [
    CommonModule,
    RetourModule,
    HttpClientModule
  ],
  providers: [],
  exports: [VisualiserComponent]
})
export class VisualiserModule { }
