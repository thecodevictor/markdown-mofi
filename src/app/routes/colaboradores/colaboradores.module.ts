import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "src/app/auth/auth.routing";
import { SharedModule } from "src/app/shared/shared.module";
import { ColaboradoresRoutingModule } from "./colaboradores.routes";
import { ComunicacaoApiPermissoesV1Service } from "./permissoes/services/comunicacao-api-permissoes-v1.service";
import { ComunicacaoApiGestaoContasV1Service } from "./services/comunicacao-api-gestao-contas-v1.service";
import { ComunicacaoApiGestaoMeuPerfilService } from "./services/comunicacao-api-gestao-meu-perfil.service";
import { ComunicacaoApiGestaoOutrosPerfisService } from "./services/comunicacao-api-gestao-outros-perfis.service";
import { ComunicacaoEntreComponentesContasWebService } from "./services/comunicacao-entre-componentes-contas-web.service";
import { AvatarMeuPerfilComponent } from "./meu-perfil/avatar-meu-perfil/avatar-meu-perfil.component";
import { DetalhesMeuPerfilComponent } from "./meu-perfil/detalhes-meu-perfil/detalhes-meu-perfil.component";
import { EditMeuPerfilComponent } from "./meu-perfil/edit-meu-perfil/edit-meu-perfil.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    DetalhesMeuPerfilComponent,
    EditMeuPerfilComponent,
    AvatarMeuPerfilComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ColaboradoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule
  ],
  providers: [
    ComunicacaoApiPermissoesV1Service,
    ComunicacaoApiGestaoContasV1Service,
    ComunicacaoApiGestaoMeuPerfilService,
    ComunicacaoApiGestaoOutrosPerfisService,
    ComunicacaoEntreComponentesContasWebService
  ]
})
export class ColaboradoresModule { }
