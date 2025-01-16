import { Component, Input } from '@angular/core';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { MargemDescontoDiarioV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/margem-desconto-diario-v1.model';
import { MargemDescontoPadraoV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-desconto-padrao-v1.model';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from '../../../services/mapa-diario-comunicacao-entre-componentes-v1.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MargensV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/margens-v1.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { CommonModule } from '@angular/common';
import { FormMargemComponent } from '../form-margem/form-margem.component';
import { ComunicacaoApiMargemDescontoPadraoV1Service } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/services/comunicacao-api-margem-desconto-padrao-v1.service';
import { ComunicacaoApiMargemDescontoDiarioV1Service } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/services/comunicacao-api-margem-desconto-diario-v1.service';
import { NewMargemDescontoDiarioV1Model } from 'src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/new-margem-desconto-diario-v1.model';

export interface MapMargemDescontoV1Model {
  data: string,
  isPadrao: boolean,
  margemDescontoPadrao: MargemDescontoPadraoV1Model,
  margemDescontoDiario: MargemDescontoDiarioV1Model
}

@Component({
  selector: 'app-table-row-margem-desconto',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-margem-desconto.component.html',
  styles: ``
})
export class TableRowMargemDescontoComponent {
  @Input() listaDatas: string[] = [];
  mapaMargemDesconto: MapMargemDescontoV1Model[] = [];
  periodo: {
    dtInicial: Date;
    dtFinal: Date;
  };
  $unsubscribe = new Subject<void>();
  margemPadrao: MargemDescontoPadraoV1Model;
  datasMargensDiarias: MargemDescontoDiarioV1Model[] = [];

  constructor(
    private comunicacaoComApiMargemDiaria: ComunicacaoApiMargemDescontoDiarioV1Service,
    private comunicacaoComApiMargemPadrao: ComunicacaoApiMargemDescontoPadraoV1Service,
    private loaderService: LoaderService,
    private comunicacaoEntreComponentes: MapaDiarioComunicacaoEntreComponentesV1Service,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.comunicacaoEntreComponentes.periodoDaConsulta
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        periodo => {
          this.periodo = periodo;
          this.getMargemDesconto();
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
  async getMargemDesconto(isLoaderInicial: boolean = true) {
    if (!isLoaderInicial) {
      this.loaderService.startLoader();
    }
    // Inicializa o array para armazenar os resultados
    this.mapaMargemDesconto = [];

    try {
      // obtém a margem de ocupação padrão
      const resultadoPadrao = await lastValueFrom(this.comunicacaoComApiMargemPadrao.getAllMargensDescontoPadrao());
      this.margemPadrao = resultadoPadrao.data.find((e: MargemDescontoPadraoV1Model) => e.status);
      this.comunicacaoEntreComponentes.emitirMargemDescontoPadrao(this.margemPadrao.margemDesconto);

      // obtém a margem de ocupação diária
      const resultadoMargensDiarias = await lastValueFrom(this.comunicacaoComApiMargemDiaria.getAllMargemDescDiario())

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
   * Define a margem de desconto para um dia específico.
   *
   * Esta função verifica se a data informada tem uma margem de desconto padrão
   * ou diária. Caso tenha, retorna a margem de desconto em porcentagem.
   * Caso contrário, retorna 'ND' (não definido).
   *
   * @param dia Data em que a margem de desconto deve ser definida.
   *
   * @returns A margem de desconto em porcentagem se a data tem uma margem de desconto
   *          cadastrada. Caso contrário, retorna 'ND' (não definido).
   */
  definirMargemDia(dia: string): string {
    const margem = this.mapaMargemDesconto.find((e: MapMargemDescontoV1Model) => e.data === dia)!;

    let retorno = 'ND';

    if (margem!) {
      if (margem?.isPadrao) {
        // Se a margem for padrão, verifica se existe uma margem padrão cadastrada
        if (margem.margemDescontoPadrao) {
          // Se tiver uma margem padrão cadastrada, retorna a margem de desconto
          retorno = margem.margemDescontoPadrao.margemDesconto + '%';
        }

      } else {
        if (margem.margemDescontoDiario) {
          // Se a margem for diária, retorna a margem de desconto
          retorno = margem?.margemDescontoDiario?.margemDesconto + '%';
        }
      }
    }

    return retorno;
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
    const margem = this.mapaMargemDesconto.find((e: MapMargemDescontoV1Model) => e.data === dia)!;

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
      const descontoDiario = this.datasMargensDiarias.find((e: MargemDescontoDiarioV1Model) => {
        const dataStr = new Date(e.data).toISOString().split('T')[0];
        return dataStr === dia && !e.excluded;
      });

      if (descontoDiario!) {
        this.mapaMargemDesconto.push({
          data: dia,
          isPadrao: false,
          margemDescontoPadrao: this.margemPadrao ?? {} as MargemDescontoPadraoV1Model,
          margemDescontoDiario: descontoDiario
        });
      } else {
        this.mapaMargemDesconto.push({
          data: dia,
          isPadrao: true,
          margemDescontoPadrao: this.margemPadrao ?? {} as MargemDescontoPadraoV1Model,
          margemDescontoDiario: {} as MargemDescontoDiarioV1Model
        });
      }
    })
  }

  /**
   * Abre o modal para editar/criar uma 'Margem de Desconto'.
   *
   * @param dia A data para a qual a 'Margem de Desconto' sera
   *            criada/editada.
   */
  abrirModalFormDesconto(dia: string) {
    // Encontra a 'margem' para o dia especificado
    const margem = this.mapaMargemDesconto.find((e: MapMargemDescontoV1Model) => e.data === dia)!;

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
    modalRef.componentInstance.tipoMargemSendoDefinida = 'desconto';

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
   * Remove uma 'Margem de Desconto' do banco de dados.
   *
   * @param _id O ID da 'Margem de Desconto' a ser removida.
   */
  async removerMargem(_id: string) {
    this.loaderService.startLoader();
    try {
      const resultadoExclusao = await lastValueFrom(this.comunicacaoComApiMargemDiaria.putMargemDescDiario({ _id }))

      if (resultadoExclusao.success) {
        // Atualiza a lista de 'Margens de Desconto' após a remoção
        this.getMargemDesconto(false);
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
   * Salva uma nova 'Margem de Desconto' no banco de dados.
   *
   * @param dados Dados da 'Margem de Desconto' a ser salva.
   */
  async postNovaMargem(dados: MargensV1Model) {
    try {
      // Cria um objeto com a 'Margem de Desconto' a ser salva
      const margemDesconto: NewMargemDescontoDiarioV1Model = {
        margemDesconto: [dados]
      };

      // Realiza o POST para salvar a 'Margem de Desconto'
      const resultado = await lastValueFrom(this.comunicacaoComApiMargemDiaria.postMargemDescDiario(
        margemDesconto, true
      ));

      if (resultado.success) {
        // Atualiza a lista de 'Margens de Desconto' após a inclusao
        this.getMargemDesconto(false);
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
