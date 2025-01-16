import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../../../services/tarifario-comunicacao-entre-componentes-v1.service';
import { Subject, takeUntil } from 'rxjs';
import { TarifarioV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tarifario-v1.model';
import { TarifarioAgrupadoV1Interface } from '../../../models/tarifario-agrupado-v1.interface';

@Component({
  selector: 'app-lista-uh-por-tarifario',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './lista-uh-por-tarifario.component.html',
  styles: ``
})
export class ListaUhPorTarifarioComponent implements OnDestroy {
  // variáveis de ambiente
  tarifarioAgrupadoPorUh: TarifarioAgrupadoV1Interface[] = [];
  tarifarioSelecionado: TarifarioV1Model | undefined = undefined
  $unsubscribe = new Subject<void>()

  constructor(
    private comunicacaoEntreComponentes: TarifarioComunicacaoEntreComponentesV1Service
  ) {
    this.comunicacaoEntreComponentes.tarifarioSelecionado.pipe(takeUntil(this.$unsubscribe))
      .subscribe(tarifario => {
        this.tarifarioSelecionado = tarifario
      })

    this.comunicacaoEntreComponentes.tarifarioAgrupadoPorUh.pipe(takeUntil(this.$unsubscribe))
      .subscribe(tarifarioAgrupadoPorUh => {
        this.tarifarioAgrupadoPorUh = tarifarioAgrupadoPorUh.filter(e => e.tipoUh!)
      })
  }
  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  emitirUhSelecionado(uh: TarifarioAgrupadoV1Interface) {
    this.comunicacaoEntreComponentes.emitirIsUhSelecionado(true)
    this.comunicacaoEntreComponentes.emitirTarifasUh(uh);
  }
}
