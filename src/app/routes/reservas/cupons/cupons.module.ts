import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { CuponsRoutingModule } from "./cupons.routing";
import { FormCupomComponent } from './form-cupom/form-cupom.component';
import { DetalhesCupomComponent } from './detalhes-cupom/detalhes-cupom.component';
import { CupomIndividualComponent } from "./cupom-individual/cupom-individual.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CupomPromocionalComponent } from "./cupom-promocional/cupom-promocional.component";
import { CupomTemporadaComponent } from "./cupom-temporada/cupom-temporada.component";
import { FormNovoCupomTemporadaComponent } from './cupom-temporada/form-novo-cupom-temporada/form-novo-cupom-temporada.component';
import { DetalhesCupomTemporadaComponent } from './cupom-temporada/detalhes-cupom-temporada/detalhes-cupom-temporada.component';
import { CurrencyMaskModule } from 'ng2-currency-mask'; 


@NgModule({
  declarations: [
    CupomIndividualComponent,
    CupomPromocionalComponent,
    DetalhesCupomComponent,
    FormCupomComponent,
    CupomTemporadaComponent,
    FormNovoCupomTemporadaComponent,
    DetalhesCupomTemporadaComponent,
    FormNovoCupomTemporadaComponent,
    DetalhesCupomTemporadaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CuponsRoutingModule,
    FontAwesomeModule,
    CurrencyMaskModule,
  ],
  exports: [
   
  ],
  providers: [
   
  ]
})
export class CuponsModule {}
