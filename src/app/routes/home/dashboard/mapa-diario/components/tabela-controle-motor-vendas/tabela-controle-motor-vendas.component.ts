import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from '../../../services/mapa-diario-comunicacao-entre-componentes-v1.service';
import { Subject, takeUntil } from 'rxjs';
import { TableRowDatasIndisponiveisComponent } from '../table-row-datas-indisponiveis/table-row-datas-indisponiveis.component';
import { TableRowMargemOcupacaoComponent } from '../table-row-margem-ocupacao/table-row-margem-ocupacao.component';
import { TableRowMargemDescontoComponent } from '../table-row-margem-desconto/table-row-margem-desconto.component';
import { TableRowMinimoDiariaComponent } from '../table-row-minimo-diaria/table-row-minimo-diaria.component';
import { TableRowDisponibilidadeDescontoComponent } from '../table-row-disponibilidade-desconto/table-row-disponibilidade-desconto.component';
import { TableRowMaximoDiariaComponent } from '../table-row-maximo-diaria/table-row-maximo-diaria.component';

@Component({
  selector: 'app-tabela-controle-motor-vendas',
  standalone: true,
  imports: [
    CommonModule,
    TableRowDatasIndisponiveisComponent,
    TableRowMargemOcupacaoComponent,
    TableRowMargemDescontoComponent,
    TableRowMinimoDiariaComponent,
    TableRowMaximoDiariaComponent,
    TableRowDisponibilidadeDescontoComponent
  ],
  templateUrl: './tabela-controle-motor-vendas.component.html',
})
export class TabelaControleMotorVendasComponent {
  listaDatas: string[] = [];
  $unsubscribe = new Subject<void>();

  constructor(
    private comunicacaoEntreComponentes: MapaDiarioComunicacaoEntreComponentesV1Service
  ) {
    comunicacaoEntreComponentes.periodoDaConsulta
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        periodo => {
          this.listaDatas = this.definirDatas(
            periodo.dtInicial,
            periodo.dtFinal
          );
        }
      )
  }

  /**
   * Gera um array de datas no formato de string "YYYY-MM-DD", partindo de uma data
   * inicial e final.
   * @param dataInicial Data inicial
   * @param dataFinal Data final
   * @returns Um array de datas no formato de string "YYYY-MM-DD"
   */
  definirDatas(dataInicial: Date, dataFinal: Date): string[] {
    let datas: Date[] = [];
    let currentDate: Date = new Date(dataInicial.setUTCHours(0, 0, 0, 0));
    const dtFinal: Date = new Date(dataFinal.setUTCHours(0, 0, 0, 0));

    // Enquanto a data atual for menor ou igual a data final, acrescenta a data atual
    // no array de datas e incrementa a data atual em um dia.
    while (currentDate <= dtFinal) {
      datas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Converte o array de datas para um array de strings no formato "YYYY-MM-DD"
    return datas.map(date => date.toISOString().slice(0, 10));
  }
}
