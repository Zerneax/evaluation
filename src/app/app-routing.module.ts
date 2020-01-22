import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ClasseComponent } from './pages/classe/classe.component';
import { VisualiserComponent } from './pages/visualiser/visualiser.component';


const routes: Routes = [
   {path: '', component: WelcomeComponent},
   {path: 'classe', component: ClasseComponent},
   {path: 'exporter', component: VisualiserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
