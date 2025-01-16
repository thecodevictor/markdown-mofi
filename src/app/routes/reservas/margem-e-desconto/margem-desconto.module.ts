import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MargemDescontoRoutingModule } from './margem-desconto.routing';
import { DescontoPadraoComponent } from './margem-desconto-padrao/desconto-padrao/desconto-padrao.component';
import { OcupacaoPadraoComponent } from './margem-desconto-padrao/ocupacao-padrao/ocupacao-padrao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormMargemComponent } from './margem-desconto-padrao/form-margem/form-margem.component';
import { DescontoDiarioComponent } from './margem-desconto-diario/desconto-diario/desconto-diario.component';
import { OcupacaoDiariaComponent } from './margem-desconto-diario/ocupacao-diaria/ocupacao-diaria.component';
import { FormMargemDescontoOcupacaoComponent } from './margem-desconto-diario/form-margem-desconto-ocupacao/form-margem-desconto-ocupacao.component';

@NgModule({
  
  declarations: [
    DescontoPadraoComponent,
    OcupacaoPadraoComponent,
    FormMargemComponent,
    DescontoDiarioComponent,
    OcupacaoDiariaComponent,
    FormMargemDescontoOcupacaoComponent
  ],

  imports: [
    CommonModule,
    MargemDescontoRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule
  ]

})

export class MargemDescontoModule { }
