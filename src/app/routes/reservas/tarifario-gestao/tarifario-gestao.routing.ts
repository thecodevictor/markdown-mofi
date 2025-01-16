import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_core/guards/auth.guard';
import { TarifarioGestaoComponent } from './tarifario-gestao.component';
import { FormTarifasComponent } from './components/form-tarifas/form-tarifas.component';
import { TabelaTarifasComponent } from './components/tabela-tarifas/tabela-tarifas.component';
import { UnidadesHoteleirasComponent } from './unidades-hoteleiras/unidades-hoteleiras.component';

const routes: Routes = [
  {
    path: '',
    component: TarifarioGestaoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'uh',
    component: UnidadesHoteleirasComponent,
    data: {
      title: 'Unidades Hoteleiras',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Unidades Hoteleiras',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'tarifas/:id_tarifario',
    component: TabelaTarifasComponent,
    data: {
      title: 'Tarifas',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Tarifas',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'tarifas/:id_tarifario/cadastrar',
    component: FormTarifasComponent,
    data: {
      title: 'Cadastrar Tarifa',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Tarifas',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'tarifas/:id_tarifario/cadastrar/:id_tarifa', // caso o usuário esteja editando uma tarifa específica00
    component: FormTarifasComponent,
    data: {
      title: 'Cadastrar Tarifa',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Tarifas',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'tarifas/:id_tarifario/cadastrar/:periodo_tarifa', //caso o usuário esteja adicionando a tarifa de um periodo específico
    component: FormTarifasComponent,
    data: {
      title: 'Cadastrar Tarifa',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Tarifas',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'tarifas/:id_tarifario/cadastrar/:id_tipo_uh', //caso o usuário esteja adicionando a tarifa de um periodo específico
    component: FormTarifasComponent,
    data: {
      title: 'Cadastrar Tarifa',
      parentBreadcrumb: 'Gestão',
      breadcrumb: 'Tarifas',
    },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifarioGestaoRoutingModule { }
