import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_core/guards/auth.guard';
import { MapaDiarioComponent } from './mapa-diario/mapa-diario.component';
import { TarifarioComponent } from './tarifario/tarifario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tarifario',
    pathMatch: 'full'
  },
  {
    path: 'mapa-diario',
    component: MapaDiarioComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Mapa Diário',
      breadcrumb: 'Mapa Diário',
    }
  },
  {
    path: 'tarifario',
    canActivate: [AuthGuard],
    component: TarifarioComponent,
    data: {
      title: 'Tarifário',
      breadcrumb: 'Tarifário',
    }
  },
  {
    path: 'tarifario/:idTarifario',
    canActivate: [AuthGuard],
    component: TarifarioComponent,
    data: {
      title: 'Tarifário',
      breadcrumb: 'Tarifário',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
