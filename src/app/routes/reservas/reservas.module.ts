import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ReservasRoutingModule } from "./reservas.routing";
import { CoreModule } from "src/app/_core/core.module";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CuponsModule } from "./cupons/cupons.module";
import { PromocoesComponent } from './promocoes/promocoes.component';
import { DetalhesPromocaoComponent } from './promocoes/detalhes-promocao/detalhes-promocao.component';
import { FormNovaPromocaoComponent } from './promocoes/form-nova-promocao/form-nova-promocao.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DatasIndisponiveisComponent } from './datas-indisponiveis/datas-indisponiveis.component';
import { MinimoDiariasComponent } from './minimo-diarias/minimo-diarias.component';
import { FormNovaDataIndisponivelComponent } from './datas-indisponiveis/form-nova-data-indisponivel/form-nova-data-indisponivel.component';
import { FormNewMinimoComponent } from './minimo-diarias/form-new-minimo/form-new-minimo.component';


@NgModule({
  declarations: [ 
    PromocoesComponent,
    DetalhesPromocaoComponent,
    FormNovaPromocaoComponent,
    DatasIndisponiveisComponent,
    MinimoDiariasComponent,
    FormNovaDataIndisponivelComponent,
    FormNewMinimoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ReservasRoutingModule,
    CoreModule,
    FontAwesomeModule,
    CurrencyMaskModule,
    NgbModule
  ],
  providers: [NgbModal],
  exports: [
    
  ]
})
export class ReservasModule {}
