import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/guards/auth.guard";
import { NgModule } from "@angular/core";
import { ContasWebComponent } from "./contas-web/contas-web.component";
import { DetalhesMeuPerfilComponent } from "./meu-perfil/detalhes-meu-perfil/detalhes-meu-perfil.component";

const colaboradores: Routes = [
  {
    path: '',
    children: [
      {
        // acessado pelo item do dropdown menu do header 'meu perfil'
        path: "meu-perfil",
        component: DetalhesMeuPerfilComponent,
        data: {
          title: "Meu Perfil",
          breadcrumb: "Meu Perfil",
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'contas-web',
        component: ContasWebComponent,
        data: {
          title: 'Gestão das Contas web',
          breadcrumb: 'Perfil Cliente',
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'permissoes',
        loadComponent: () => import('./permissoes/permissoes.component')
          .then(m => m.PermissoesComponent),
      }
    ],
  }
];
@NgModule({
  imports: [RouterModule.forChild(colaboradores)],
  exports: [RouterModule]
})
export class ColaboradoresRoutingModule { }


