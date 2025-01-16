import { Component, Input, OnDestroy } from '@angular/core';
import { ComunicacaoApiMargemOcupacaoDiarioV1Service } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/services/comunicaco-api-margem-ocupacao-diario-v1.service';
import { MargemOcupacaoDiarioV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-ocupacao-diario-v1.model';
import { MargemOcupacaoPadraoV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-ocupacao-padrao-v1.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from '../../../services/mapa-diario-comunicacao-entre-componentes-v1.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { ComunicacaoApiMargemOcupacaoPadraoV1Service } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/services/comunicacao-api-margem-ocupacao-padrao-v1.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormMargemComponent } from '../form-margem/form-margem.component';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { MargensV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/margens-v1.model';
import { NewMargemOcupacaoDiarioV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/new-margem-ocupacao-diario-v1.model';

export interface MapMargemOcupacaoV1Model {
  data: string,
  isPadrao: boolean,
  margemOcupacaoPadrao: MargemOcupacaoPadraoV1Model,
  margemOcupacaoDiario: MargemOcupacaoDiarioV1Model
}

@Component({
  selector: 'app-table-row-margem-ocupacao',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-margem-ocupacao.component.html',
  styles: ``
})
export class TableRowMargemOcupacaoComponent implements OnDestroy {
  @Input() listaDatas: string[] = [];
  mapaMargemOcupacao: MapMargemOcupacaoV1Model[] = [];
  periodo: {
    dtInicial: Date;
    dtFinal: Date;
  };
  $unsubscribe = new Subject<void>();
  margemPadrao: MargemOcupacaoPadraoV1Model;
  datasMargensDiarias: MargemOcupacaoDiarioV1Model[] = [];

  constructor(
    private comunicacaoComApiMargemDiaria: ComunicacaoApiMargemOcupacaoDiarioV1Service,
    private comunicacaoComApiMargemPadrao: ComunicacaoApiMargemOcupacaoPadraoV1Service,
    private loaderService: LoaderService,
    private comunicacaoEntreComponentes: MapaDiarioComunicacaoEntreComponentesV1Service,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.comunicacaoEntreComponentes.periodoDaConsulta.pipe(takeUntil(this.$unsubscribe)).subscribe(
      periodo => {
        this.periodo = periodo;
        this.getMargemOcupacao();
      }
    )
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  /**
   * Obtém a margem de ocupação do dia
   *
   * Esta função faz uma requisição para obter as margens de ocupação
   */
  async getMargemOcupacao(isLoaderInicial: boolean = true) {
    if (!isLoaderInicial) {
      this.loaderService.startLoader();
    }
    // Inicializa o array para armazenar os resultados
    this.mapaMargemOcupacao = [];

    try {
      // obtém a margem de ocupação padrão
      const resultadoPadrao = await lastValueFrom(this.comunicacaoComApiMargemPadrao.getAllMargensOcupacaoPadrao());
      this.margemPadrao = resultadoPadrao.data.find((e: MargemOcupacaoPadraoV1Model) => e.status);
      this.comunicacaoEntreComponentes.emitirMargemOcupacaoPadrao(this.margemPadrao.margemOcupacao);

      // obtém a margem de ocupação diária
      const resultadoMargensDiarias = await lastValueFrom(this.comunicacaoComApiMargemDiaria.getAllMargemcupacaoDiario())

      this.datasMargensDiarias = resultadoMargensDiarias.data;

      this.formatarDados();
      if (!isLoaderInicial) {
        this.loaderService.stopLoader();
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error')
        console.log(error)
      }

      if (!isLoaderInicial) {
        this.loaderService.stopLoader();
      }
    }
  }

  /**
   * Define a margem de ocupação para um dia específico.
   *
   * @param dia Data em que a margem de ocupação deve ser definida.
   *
   * @returns A margem de ocupação em porcentagem se a data tem uma margem de ocupação
   *          cadastrada. Caso contrário, retorna 'ND' (não definido).
   */
  definirMargemDia(dia: string): string {
    const margem = this.mapaMargemOcupacao.find((e: MapMargemOcupacaoV1Model) => e.data === dia)!;

    if (margem?.isPadrao) {
      // Se a margem for padrão, verifica se existe uma margem padrão cadastrada
      if (margem.margemOcupacaoPadrao) {
        return margem.margemOcupacaoPadrao.margemOcupacao + '%';
      } else {
        // Se não tiver uma margem padrão cadastrada, retorna 'ND'
        return 'ND';
      }
    } else {
      // Se a margem for diária, retorna a margem de ocupação
      return margem?.margemOcupacaoDiario?.margemOcupacao + '%' || 'ND';
    }
  }

  /**
   * Retorna a cor de background para a célula da tabela com base
   * na data informada.
   *
   * Se a data informada tiver uma margem de ocupação padrão,
   * retorna 'bg-body-secondary' (padrão).
   * Caso contrário, retorna 'bg-azul-escuro' (diário).
   *
   * @param dia Data em que a cor de background deve ser definida.
   *
   * @returns A cor de background para a célula da tabela.
   */
  definirBg(dia: string): string {
    const margem = this.mapaMargemOcupacao.find((e: MapMargemOcupacaoV1Model) => e.data === dia)!;

    if (margem?.isPadrao) {
      // Se a margem for padrão, verifica se existe uma margem padrão cadastrada
      return 'bg-body-secondary'
    } else {
      return 'bg-azul-escuro'
    }
  }

  /**
   * Formata os dados recebidos da API para serem
   * apresentados na tabela.
   */
  formatarDados() {
    /**
     * Loop pelas datas e:
     * 1. Verifica se há uma entrada na lista de margens diárias
     *    para a data atual (se sim, não é padrão);
     * 2. Cria um objeto para armazenar os dados da linha;
     * 3. Adiciona o objeto à lista de margens a serem apresentadas.
     */
    this.listaDatas.forEach((dia: string) => {
      const ocupacaoDiaria = this.datasMargensDiarias.find((e: MargemOcupacaoDiarioV1Model) => {
        const dataStr = new Date(e.data).toISOString().split('T')[0];
        return dataStr === dia && !e.excluded;
      });

      if (ocupacaoDiaria!) {
        this.mapaMargemOcupacao.push({
          data: dia,
          isPadrao: false,
          margemOcupacaoPadrao: this.margemPadrao ?? {} as MargemOcupacaoPadraoV1Model,
          margemOcupacaoDiario: ocupacaoDiaria
        });
      } else {
        this.mapaMargemOcupacao.push({
          data: dia,
          isPadrao: true,
          margemOcupacaoPadrao: this.margemPadrao ?? {} as MargemOcupacaoPadraoV1Model,
          margemOcupacaoDiario: {} as MargemOcupacaoDiarioV1Model
        });
      }
    })
  }
  /**
   * Abre o modal para editar/criar uma 'Margem de Ocupacao'.
   *
   * @param dia A data para a qual a 'Margem de Ocupacao' sera
   *            criada/editada.
   */
  abrirModalFormOcupacao(dia: string) {
    // Encontra a 'margem' para o dia especificado
    const margem = this.mapaMargemOcupacao.find((e: MapMargemOcupacaoV1Model) => e.data === dia)!;

    // Abre o modal com as opcoes especificadas
    const modalRef = this.modalService.open(
      FormMargemComponent,
      {
        size: 'sm', // Tamanho pequeno do modal
        centered: true, // Centraliza o modal na tela
        keyboard: false, // Desabilita fechar o modal via teclado
      }
    );

    // Passa os dados da 'margem' selecionada para a instancia do modal
    modalRef.componentInstance.dataSelecionada = margem;
    modalRef.componentInstance.tipoMargemSendoDefinida = 'ocupacao';

    // Manipula o evento de fechamento do modal
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        this.postNovaMargem(resultado.data);
      } else {
        if (resultado.titulo.includes('Remover')) {
          this.removerMargem(resultado.data)
        }
      }

      if (resultado.titulo.includes('cancelada')) {
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          'info'
        );
      }
    });
  }

  /**
   * Remove uma 'Margem de Ocupacao' do banco de dados.
   *
   * @param _id O ID da 'Margem de Ocupacao' a ser removida.
   */
  async removerMargem(_id: string) {
    this.loaderService.startLoader();
    try {
      const resultadoExclusao = await lastValueFrom(this.comunicacaoComApiMargemDiaria.putMargemOcupacaoDiario({ _id }))

      if (resultadoExclusao.success) {
        // Atualiza a lista de 'Margens de Ocupacao' após a remoção
        this.getMargemOcupacao(false);
      }

      // Para o loader
      this.loaderService.stopLoader();

      // Mostra uma mensagem com base no resultado da operacao
      this.mensagemToastrService.show(
        resultadoExclusao.message,
        resultadoExclusao.titulo,
        resultadoExclusao.success ? 'success' : 'error'
      );
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        // Mostra o erro no console
        console.log('error')
        console.log(error)
      }
      this.loaderService.stopLoader();
    }
  }

  /**
   * Salva uma nova 'Margem de Ocupacao' no banco de dados.
   *
   * @param dados Dados da 'Margem de Ocupacao' a ser salva.
   */
  async postNovaMargem(dados: MargensV1Model) {
    try {
      // Cria um objeto com a 'Margem de Ocupacao' a ser salva
      const margemOcupacao: NewMargemOcupacaoDiarioV1Model = {
        margemOcupacao: [dados]
      };

      // Realiza o POST para salvar a 'Margem de Ocupacao'
      const resultado = await lastValueFrom(this.comunicacaoComApiMargemDiaria.postMargemOcupacaoDiario(
        margemOcupacao, true
      ));

      if (resultado.success) {
        // Atualiza a lista de 'Margens de Ocupacao' após a inclusao
        this.getMargemOcupacao(false);
      }

      // Mostra uma mensagem com base no resultado da operacao
      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      );

      // Para o loader
      this.loaderService.stopLoader();
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        // Mostra o erro no console
        console.log('error')
        console.log(error)
      }
      // Para o loader
      this.loaderService.stopLoader();
    }
  }
}
