import { NgModule } from '@angular/core';
import { ClasseComponent } from './classe.component';
import { RetourModule } from '../global/retour/retour.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
  declarations: [
    ClasseComponent
  ],
  imports: [
    CommonModule,
    RetourModule,
    FormsModule,
    ReactiveFormsModule,
    FileSaverModule
  ],
  providers: [],
  exports: [ClasseComponent]
})
export class ClasseModule { }
