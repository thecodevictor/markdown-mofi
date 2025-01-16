import { Component, OnDestroy, OnInit } from '@angular/core';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../../../services/tarifario-comunicacao-entre-componentes-v1.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { TarifarioAgrupadoV1Interface } from '../../../models/tarifario-agrupado-v1.interface';
import { TarifarioV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tarifario-v1.model';
import { TarifasV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tarifas-v1.model';
import { TabelaTarifasUhV1Interface } from '../../../models/tabela-tarifas-uh-v1.interface';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-tabela-tarifas-uh',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tabela-tarifas-uh.component.html',
  styles: ``
})
export class TabelaTarifasUhComponent implements OnInit, OnDestroy {
  $unsubscribe = new Subject<void>();
  tarifarioSelecionado?: TarifarioV1Model;
  tarifasUh?: TarifarioAgrupadoV1Interface;

  tabelaTarifasUh: TabelaTarifasUhV1Interface[] = [];

  constructor(
    private comunicacaoEntreComponentes: TarifarioComunicacaoEntreComponentesV1Service,
    public formatarParaReal: FormatarValoresService,
    private router: Router
  ) {
    this.comunicacaoEntreComponentes.tarifasUh.pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        (tarifas) => {
          this.tarifasUh = tarifas
          this.formatarTarifasParaInterfaceDaTabela();
        }
      );

    this.comunicacaoEntreComponentes.tarifarioSelecionado.pipe(takeUntil(this.$unsubscribe))
      .subscribe((tarifario) => this.tarifarioSelecionado = tarifario);
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  ngOnInit(): void { }

  /**
   * Retorna o label da tarifa com base em sua configuração de dias da semana.
   * @param tarifa - A tarifa a ser formatada.
   * @returns O label da tarifa.
   */
  definirLabelTipoTarifa(tipo: string): string {
    if (tipo == 'isDomingoAQuinta') {
      // Tarifa para domingo à quinta
      return 'Domingo à Quinta';
    } else if (tipo == 'isQuintaADomingo') {
      // Tarifa para quinta à domingo
      return 'Quinta à Domingo';
    } else if (tipo == "isAltaTemporadaEFeriados") {
      // Tarifa para alta temporada e feriados
      return 'Alta Temporada e Feriados';
    } else {
      // Tarifa padrão
      return 'Tarifa Padrão';
    }
  }

  /**
   * Formata as tarifas recebidas para a interface da tabela
   *
   * @remarks
   *   Percorre as tarifas recebidas e as formata para a interface da tabela.
   *   Cada tarifa é transformada em um objeto com as seguintes propriedades:
   *     - tipo: O tipo da tarifa (definido pela função `definirTipo`).
   *     - tarifas: Um array de objetos com as seguintes propriedades:
   *       - quarto: O tipo de quarto.
   *       - cafeManha: O valor da tarifa para o café da manhã.
   *       - meiaPensao: O valor da tarifa para a meia pensão.
   */
  formatarTarifasParaInterfaceDaTabela() {
    // Percorre as tarifas recebidas
    let tarifaPorTipo: TabelaTarifasUhV1Interface[] = [];

    // Verifica se há algum período sem tarifas
    const hasQuintaADomingo = this.verificarSePeriodoNaoPossuiTarifa(this.tarifasUh?.tarifas!).hasQuintaADomingo;
    const hasDomingoAQuinta = this.verificarSePeriodoNaoPossuiTarifa(this.tarifasUh?.tarifas!).hasDomingoAQuinta;
    const hasAltaTemporadaEFeriados = this.verificarSePeriodoNaoPossuiTarifa(this.tarifasUh?.tarifas!).hasAltaTemporadaEFeriados;

    if (!hasDomingoAQuinta) {
      tarifaPorTipo.push(
        {
          tipo: 'isDomingoAQuinta',
          tarifas: []
        }
      )
    } else if (!hasQuintaADomingo) {
      tarifaPorTipo.push(
        {
          tipo: 'isQuintaADomingo',
          tarifas: []
        }
      )
    } else if (!hasAltaTemporadaEFeriados) {
      tarifaPorTipo.push(
        {
          tipo: 'isAltaTemporadaEFeriados',
          tarifas: []
        }
      )
    }

    this.tarifasUh?.tarifas.forEach((tarifa) => {
      tarifaPorTipo.push(
        {
          tipo: this.definirTipo(tarifa),
          tarifas: [
            {
              quarto: 'SINGLE',
              cafeManha: tarifa.valorPensaoCafeManha?.simples!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.simples!
            },
            {
              quarto: 'DUPLO',
              cafeManha: tarifa.valorPensaoCafeManha?.duplo!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.duplo!
            },
            {
              quarto: 'TRIPLO',
              cafeManha: tarifa.valorPensaoCafeManha?.triplo!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.triplo!
            },
            {
              quarto: 'QUÁDRUPLO',
              cafeManha: tarifa.valorPensaoCafeManha?.quadruplo!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.quadruplo!
            },
            {
              quarto: 'QUINTUPLO',
              cafeManha: tarifa.valorPensaoCafeManha?.quintuplo!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.quintuplo!
            },
            {
              quarto: 'ADICIONAL',
              cafeManha: tarifa.valorPensaoCafeManha?.adicional!,
              meiaPensao: tarifa.valorMeiaPensaoAlmoco?.adicional!
            }
          ]
        }
      )
    });

    // Ordena as tarifas por tipo, descrescente
    tarifaPorTipo.sort((a, b) => {
      if (a.tipo < b.tipo) {
        return 1;
      } else if (a.tipo > b.tipo) {
        return -1;
      } else {
        return 0;
      }
    });

    this.tabelaTarifasUh = tarifaPorTipo;
  }

  /**
   * Verifica se o período de tempo informado não tem nenhuma tarifa definida.
   * @param tarifas - O array de tarifas a serem verificadas.
   * @returns Um objeto com as seguintes propriedades, todas `boolean`:
   *          - `hasQuintaADomingo`: Indica se há pelo menos uma tarifa definida para o período de quinta-feira a domingo.
   *          - `hasDomingoAQuinta`: Indica se há pelo menos uma tarifa definida para o período de domingo a quinta-feira.
   *          - `hasAltaTemporadaEFeriados`: Indica se há pelo menos uma tarifa definida para a temporada de alta e feriados.
   */
  verificarSePeriodoNaoPossuiTarifa(tarifas: TarifasV1Model[]) {
    const hasQuintaADomingo = tarifas.some(tarifa => tarifa.isQuintaADomingo);
    const hasDomingoAQuinta = tarifas.some(tarifa => tarifa.isDomingoAQuinta);
    const hasAltaTemporadaEFeriados = tarifas.some(tarifa => tarifa.isAltaTemporadaEFeriados);

    return {
      'hasQuintaADomingo': hasQuintaADomingo,
      'hasDomingoAQuinta': hasDomingoAQuinta,
      'hasAltaTemporadaEFeriados': hasAltaTemporadaEFeriados
    }
  }

  /**
   * Define o tipo da tarifa com base nas suas características.
   * @param tarifa - O modelo de tarifa a ser definido.
   * @returns O tipo da tarifa.
   */
  definirTipo(tarifa: TarifasV1Model): string {
    if (tarifa.isDomingoAQuinta) {
      // Tarifa para dias de semana (domingo a quinta-feira).
      return 'isDomingoAQuinta'
    } else if (tarifa.isQuintaADomingo) {
      // Tarifa para fins de semana (quinta-feira a domingo).
      return 'isQuintaADomingo'
    } else if (tarifa.isAltaTemporadaEFeriados) {
      // Tarifa para datas de alta temporada e feriados.
      return 'isAltaTemporadaEFeriados'
    } else {
      // Tarifa padrão para datas de baixa temporada e dias de semana.
      return 'isPadrao'
    }
  }

  /**
   * Navega para a página de cadastro de tarifa.
   * @param periodo - O período de tempo para o qual a tarifa será cadastrada.
   */
  navegarAteFormTarifa(periodo: string) {
    // Navega para a página de cadastro de tarifa.
    this.router.navigate([
      '/reservas/gestao-tarifario/tarifas/',
      this.tarifarioSelecionado!._id,
      'cadastrar',
      { periodo_tarifa: periodo, id_tipo_uh: this.tarifasUh!.tipoUh._id }
    ])
  }
}
