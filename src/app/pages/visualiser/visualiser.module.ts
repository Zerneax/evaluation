import { VisualiserComponent } from './visualiser.component';
import { NgModule } from '@angular/core';
import { RetourModule } from '../global/retour/retour.module';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VisualiserComponent
  ],
  imports: [
    CommonModule,
    RetourModule,
    FormsModule
  ],
  providers: [DatePipe],
  exports: [VisualiserComponent]
})
export class VisualiserModule { }
