import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/_core/guards/auth.guard";
import { CupomIndividualComponent } from "./cupom-individual/cupom-individual.component";
import { CupomPromocionalComponent } from "./cupom-promocional/cupom-promocional.component";
import { CupomTemporadaComponent } from "./cupom-temporada/cupom-temporada.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'individual',
        component: CupomIndividualComponent,
        data: {
          title: 'Cupom Individual',
          breadcrumb: 'Cupom Individual',
        },
        canActivate: [AuthGuard]
      },
    ],
  },
  {
    path: 'promocional',
    component: CupomPromocionalComponent,
    data: {
      title: 'Cupom Promocional',
      breadcrumb: 'Cupom Promocional',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'temporada',
    component: CupomTemporadaComponent,
    data: {
      title: 'Cupom Temporada',
      breadcrumb: 'Cupom Temporada',
    },
    canActivate: [AuthGuard]
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuponsRoutingModule { }
