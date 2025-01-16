import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarifarioGestaoRoutingModule } from './tarifario-gestao.routing';
import { ComunicacaoApiTarifarioV1Service } from '../../home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../../home/dashboard/services/tarifario-comunicacao-entre-componentes-v1.service';
import { TarifasComunicacaoApiV1Service } from './services/tarifas-comunicacao-api-v1.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TarifarioGestaoComponent } from './tarifario-gestao.component';


@NgModule({
  declarations: [
    TarifarioGestaoComponent
  ],
  imports: [
    CommonModule,
    TarifarioGestaoRoutingModule,
    NgxPaginationModule,
    NgbTooltipModule,
    NgbDropdownModule
  ],
  providers: [
    ComunicacaoApiTarifarioV1Service,
    TarifarioComunicacaoEntreComponentesV1Service,
    TarifasComunicacaoApiV1Service
  ]
})
export class TarifarioGestaoModule { }
