import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/_core/guards/auth.guard";
import { PromocoesComponent } from "./promocoes/promocoes.component";
import { FormNovaPromocaoComponent } from "./promocoes/form-nova-promocao/form-nova-promocao.component";
import { DatasIndisponiveisComponent } from "./datas-indisponiveis/datas-indisponiveis.component";
import { MinimoDiariasComponent } from "./minimo-diarias/minimo-diarias.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gestao-tarifario',
        loadChildren: () => import('./tarifario-gestao/tarifario-gestao.module')
          .then(m => m.TarifarioGestaoModule),
        data: {
          title: 'Gestão Tarifário',
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'cupons',
        loadChildren: () => import('./cupons/cupons.module').then(m => m.CuponsModule),
        data: {
          title: 'Cupons',
          breadcrumb: 'Cupons',
        },
      },
      {
        path: 'promocoes',
        component: PromocoesComponent,
        data: {
          title: 'Promoções',
          breadcrumb: 'Promoções',
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'promocoes/:tipo',
        component: FormNovaPromocaoComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Promoções',
          breadcrumb: 'Promoções',
        },
      },
      {
        path: 'margem-e-desconto',
        loadChildren: () => import('./margem-e-desconto/margem-desconto.module')
          .then(m => m.MargemDescontoModule),
        canActivate: [AuthGuard],
        data: {
          title: 'Margem e Desconto',
          breadCrumb: 'Margem e Desconto',
        }
      },
      {
        path: 'datas-indisponiveis',
        component: DatasIndisponiveisComponent,
        data: {
          title: 'Datas indisponiveis',
          breadcrumb: 'Definir datas indisponiveis',
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'limite-diarias',
        component: MinimoDiariasComponent,
        data: {
          title: 'Limite de diarias',
          breadcrumb: 'Definir limite de diária',
        },
        canActivate: [AuthGuard]
      },
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
