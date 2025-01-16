import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_core/guards/auth.guard';
import { DescontoPadraoComponent } from './margem-desconto-padrao/desconto-padrao/desconto-padrao.component';
import { OcupacaoPadraoComponent } from './margem-desconto-padrao/ocupacao-padrao/ocupacao-padrao.component';
import { DescontoDiarioComponent } from './margem-desconto-diario/desconto-diario/desconto-diario.component';
import { OcupacaoDiariaComponent } from './margem-desconto-diario/ocupacao-diaria/ocupacao-diaria.component';
import { DisponibilidadeDescontoComponent } from './disponibilidade-desconto/disponibilidade-desconto.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'disponibilidade-desconto',
          component: DisponibilidadeDescontoComponent,
          data: {
            title: 'Disponibilidade x Desconto',
            breadcrumb: 'Disponibilidade x Desconto',
          },
          canActivate: [AuthGuard]
        },
      ],
    },
    {
      path: 'desconto-padrao',
      component: DescontoPadraoComponent,
      data: {
        title: 'Desconto padrão',
        breadcrumb: 'Margem e desconto',
      },
      canActivate: [AuthGuard]
    },
    {
      path: 'ocupacao-padrao',
      component: OcupacaoPadraoComponent,
      data: {
        title: 'Ocupacao Padrão',
        breadcrumb: 'Margem e desconto',
      },
      canActivate: [AuthGuard]
    },
    {
      path: 'desconto-diario',
      component: DescontoDiarioComponent,
      data: {
        title: 'Desconto Diario',
        breadcrumb: 'Margem e desconto',
      },
      canActivate: [AuthGuard]
    },
    {
      path: 'ocupacao-diaria',
      component: OcupacaoDiariaComponent,
      data: {
        title: 'Ocupacao diaria',
        breadcrumb: 'Margem e desconto',
      },
      canActivate: [AuthGuard]
    },
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MargemDescontoRoutingModule { }
