import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { LimiteDiariasV1Model } from 'src/app/routes/reservas/minimo-diarias/models/limite-diarias-v1-model';
import { ComunicacaoApiLimiteDiariasV1Service } from 'src/app/routes/reservas/minimo-diarias/service/comunicacao-api-limite-diarias-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { FormLimiteDiariaComponent } from '../form-limite-diaria/form-limite-diaria.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { MapLimitesDiariasModel } from '../../../models/map-limites-diarias';

@Component({
  selector: 'app-table-row-minimo-diaria',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-minimo-diaria.component.html',
  styles: ``
})
export class TableRowMinimoDiariaComponent implements OnChanges {
  @Input() listaDatas: string[] = [];
  mapaMinimoDiaria: MapLimitesDiariasModel[] = [];
  datasLimitesDiarias: LimiteDiariasV1Model[] = [];

  constructor(
    private loaderService: LoaderService,
    private comunicacaoComApi: ComunicacaoApiLimiteDiariasV1Service,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService
  ) { }

  ngOnChanges(): void {
    this.getLimitesDiarias();
  }

  /**
   * Busca dados de limite diário da API e os formata para exibição.
   *
   * Opcionalmente controla um indicador de carregamento durante a busca de dados.
   * Processa os resultados se a solicitação for bem-sucedida ou lida com erros caso ocorram.
   *
   * @param isLoaderInicial - Indica se deve iniciar/parar o carregador.
   */
  async getLimitesDiarias(isLoaderInicial: boolean = true) {
    if (!isLoaderInicial) {
      this.loaderService.startLoader();
    }
    // Limpa os dados existentes
    this.datasLimitesDiarias = [];
    try {
      // Busca dados da API
      const resultado = await lastValueFrom(this.comunicacaoComApi.getAll());

      // Se a solicitação for bem-sucedida, atualiza os dados
      if (resultado.success) {
        this.datasLimitesDiarias = resultado.data.filter((e: LimiteDiariasV1Model) => !e.excluded);
      }

      // Formata os dados para exibição
      this.formatarDados();
      if (!isLoaderInicial) {
        this.loaderService.stopLoader();
      }
    } catch (error) {
      // Lida com erros HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        // Loga outros erros
        console.log('erro');
        console.log(error);
      }

      // Para o carregador em caso de erro
      if (!isLoaderInicial) {
        this.loaderService.stopLoader();
      }
    }
  }

  /**
   * Formata os dados recebidos da API para serem
   * apresentados na tabela.
   */
  formatarDados() {
    this.mapaMinimoDiaria = [];

    /**
     * Loop pelas datas e:
     * 1. Verifica se há uma entrada na lista de margens diárias
     *    para a data atual (se sim, não é padrão);
     * 2. Cria um objeto para armazenar os dados da linha;
     * 3. Adiciona o objeto à lista de margens a serem apresentadas.
     */
    this.listaDatas.forEach((dia: string) => {
      const limiteDia = this.datasLimitesDiarias.find((e: LimiteDiariasV1Model) => {
        const dataStr = new Date(e.data!).toISOString().split('T')[0];
        return dataStr === dia;
      });

      if (limiteDia!) {
        this.mapaMinimoDiaria.push({
          data: dia,
          limite: limiteDia
        });
      } else {
        this.mapaMinimoDiaria.push({
          data: dia,
          limite: undefined
        });
      }
    })
  }

  /**
   * Retorna o valor de mínimo diário para a data informada
   * ou 0 se a data não tiver um valor de mínimo diário.
   *
   * @param dia - A data para a qual o valor de mínimo diário
   *            deve ser retornado.
   * @returns O valor de mínimo diário para a data informada,
   *          ou 0 se a data não tiver um valor de mínimo diário.
   */
  definindoMinimoDiaria(dia: string): number {
    const minimo = this.mapaMinimoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    // Se a data tiver um valor de mínimo diário maior do que 0,
    // retorna o valor de mínimo diário.
    if (minimo?.limite && minimo.limite?.minimo! > 0) {
      return minimo.limite?.minimo ?? 0;
    } else {
      // Caso contrário, retorna 0.
      return 0;
    }
  }

  /**
   * Retorna a cor de fundo para uma célula de tabela com base na data informada.
   *
   * Se a data tiver um valor de mínimo diário, retorna 'bg-azul-escuro'.
   * Caso contrário, retorna 'bg-body-secondary'.
   *
   * @param dia - A data para a qual a cor de fundo deve ser definida.
   * @returns A cor de fundo para a célula da tabela.
   */
  definirBg(dia: string): string {
    const minimo = this.mapaMinimoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    if (minimo?.limite && minimo.limite?.minimo! > 0) {
      // Se a data tiver um valor de mínimo diário, retorna 'bg-azul-escuro'.
      return 'bg-azul-escuro';
    } else {
      // Caso contrário, retorna 'bg-body-secondary'.
      return 'bg-body-secondary';
    }
  }

  /**
   * Abre o modal de limite diária para o dia especificado.
   * Busca o limite de diária para o dia especificado e o passa para a
   * instância do modal.
   * @param dia - A data para a qual o limite de diária será exibido.
   */
  abrirModalLimiteDiaria(dia: string) {
    // Encontra o limite de diária para o dia especificado
    const limite = this.mapaMinimoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    // Abre o modal com as opções especificadas
    const modalRef = this.modalService.open(
      FormLimiteDiariaComponent,
      {
        size: 'sm', // Tamanho pequeno do modal
        centered: true, // Centraliza o modal na tela
        keyboard: false, // Desabilita fechar o modal via teclado
      }
    );

    // Passa os dados do limite selecionado para a instância do modal
    modalRef.componentInstance.limiteDiaria = limite;
    modalRef.componentInstance.tipo = 'minimo';

    // Manipula o evento de fechamento do modal
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        if (resultado.data._id) {
          // Se o limite de diária tiver um ID, remove o limite de diária
          // anterior e cria um novo com os dados atualizados.
          this.removerECriarNovoLimite(resultado.data);
        } else {
          // Caso contrário, cria um novo limite de diária.
          this.postNovoLimite(resultado.data);
        }
      }

      if (resultado.titulo.includes('cancelada')) {
        // Mostra uma mensagem informativa se o usuário cancelou a
        // operação.
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          'info'
        );
      }
    });
  }

  /**
   * Grava um novo limite de diárias.
   * Se a solicitação for bem-sucedida, atualiza a lista de limites diárias.
   * Mostra uma mensagem de sucesso ou erro.
   * @param dados - Dados do limite de diárias a ser gravado.
   */
  async postNovoLimite(dados: LimiteDiariasV1Model) {
    dados._id = undefined;
    dados._idAccount = undefined;

    try {
      const resultado = await lastValueFrom(this.comunicacaoComApi.postNovoLimite(dados))

      if (resultado.success) {
        // Atualiza a lista de limites diárias se a solicita o for bem-sucedida
        this.getLimitesDiarias(false);
      }

      // Mostra uma mensagem de sucesso ou erro
      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      )
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Trata erros HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        // Loga outros erros
        console.log('error')
        console.log(error)
      }
    }
  }

  /**
   * Remove o limite de diárias existente e cria um novo limite.
   * 
   * Tenta remover um limite de diárias chamando a API apropriada.
   * Se a remoção for bem-sucedida, cria um novo limite de diárias.
   * Lida com erros HTTP e loga outros erros inesperados.
   * 
   * @param dados - Dados do limite de diárias a ser removido e recriado.
   */
  async removerECriarNovoLimite(dados: LimiteDiariasV1Model) {
    try {
      // Faz a solicitação para remover o limite de diárias
      const resultado = await lastValueFrom(this.comunicacaoComApi.postRemoverLimite(dados));

      // Se a remoção for bem-sucedida, cria um novo limite de diárias
      if (resultado.success) {
        this.postNovoLimite(dados);
      }
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        // Loga outros erros inesperados
        console.log('error');
        console.log(error);
      }
    }
  }
}
