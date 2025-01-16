import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard.routing';
import { ComunicacaoApiMapaDiarioV1Service } from './services/comunicacao-api-mapa-diario-v1.service';
import { ComunicacaoApiTarifarioV1Service } from './services/comunicacao-api-tarifario-v1.service';
import { TarifarioComunicacaoEntreComponentesV1Service } from './services/tarifario-comunicacao-entre-componentes-v1.service';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from './services/mapa-diario-comunicacao-entre-componentes-v1.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  providers: [
    ComunicacaoApiMapaDiarioV1Service,
    ComunicacaoApiTarifarioV1Service,
    TarifarioComunicacaoEntreComponentesV1Service,
    MapaDiarioComunicacaoEntreComponentesV1Service,
  ]
})
export class DashboardModule { }
