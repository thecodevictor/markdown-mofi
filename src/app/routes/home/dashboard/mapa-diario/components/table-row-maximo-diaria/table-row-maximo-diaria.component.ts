import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { LimiteDiariasV1Model } from 'src/app/routes/reservas/minimo-diarias/models/limite-diarias-v1-model';
import { ComunicacaoApiLimiteDiariasV1Service } from 'src/app/routes/reservas/minimo-diarias/service/comunicacao-api-limite-diarias-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { FormLimiteDiariaComponent } from '../form-limite-diaria/form-limite-diaria.component';
import { MapLimitesDiariasModel } from '../../../models/map-limites-diarias';

@Component({
  selector: 'app-table-row-maximo-diaria',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-maximo-diaria.component.html',
  styles: ``
})
export class TableRowMaximoDiariaComponent {
  @Input() listaDatas: string[] = [];
  mapaMaximoDiaria: MapLimitesDiariasModel[] = [];
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
   * Busca os dados de limite diário da API e os formata para exibição.
   *
   * Esta função opcionalmente controla um indicador de carregamento durante a busca de dados.
   * Ela processa os resultados se a solicitação for bem-sucedida ou lida com erros caso ocorram.
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
   *
   * Percorre a lista de datas e verifica se
   * cada data tem um valor de máximo diário
   * definido. Se tiver, adiciona o valor ao
   * mapa de máximo diário. Caso contrário,
   * adiciona o valor undefined ao mapa.
   */
  formatarDados() {
    this.mapaMaximoDiaria = [];

    this.listaDatas.forEach((dia: string) => {
      const limiteDia = this.datasLimitesDiarias.find((e: LimiteDiariasV1Model) => {
        // Converte a data em string para o formato "yyyy-mm-dd" e compara
        // com a data em formato string informada
        const dataStr = new Date(e.data!).toISOString().split('T')[0];
        return dataStr === dia;
      });

      if (limiteDia!) {
        this.mapaMaximoDiaria.push({
          data: dia,
          limite: limiteDia
        });
      } else {
        this.mapaMaximoDiaria.push({
          data: dia,
          limite: undefined
        });
      }
    })
  }

  /**
   * Retorna o valor do máximo diário para a data informada.
   * Se a data não tiver um valor definido, retorna 0.
   *
   * @param dia Data em formato string (yyyy-mm-dd)
   * @returns O valor do máximo diário para a data informada
   *          ou 0 se a data não tiver um valor definido.
   */
  definindoMaximoDiaria(dia: string): number {
    const maximo = this.mapaMaximoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    // Se houver um valor definido para a data, retorna o valor
    if (maximo?.limite) {
      return maximo.limite?.maximo ?? 0;
    } else {
      // Caso contrário, retorna 0
      return 0;
    }
  }

  /**
   * Retorna a cor de fundo para uma célula de tabela com base na data informada.
   *
   * Se a data tiver um limite máximo definido, retorna 'bg-azul-escuro'.
   * Caso contrário, retorna 'bg-body-secondary'.
   *
   * @param dia - A data para a qual a cor de fundo deve ser definida.
   * @returns A cor de fundo para a célula da tabela.
   */
  definirBg(dia: string): string {
    const maximo = this.mapaMaximoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    // Se houver um limite definido para a data, use o fundo azul-escuro
    if (maximo?.limite && maximo.limite?.maximo! > 0) {
      return 'bg-azul-escuro';
    } else {
      // Se não houver um limite definido, use o fundo do corpo secundário
      return 'bg-body-secondary';
    }
  }

  /**
   * Abre o modal de limite diária com as opções especificadas.
   *
   * Encontra o limite para o dia especificado e o passa como parâmetro
   * para a instância do modal. Manipula o evento de fechamento do modal
   * e grava um novo limite diária se a solicitação for bem-sucedida.
   *
   * @param dia - A data para a qual o limite diária deve ser aberto.
   */
  abrirModalLimiteDiaria(dia: string) {
    // Encontra o limite para o dia especificado
    const limite = this.mapaMaximoDiaria.find((e: MapLimitesDiariasModel) => e.data === dia)!;

    // Abre o modal com as opções especificadas
    const modalRef = this.modalService.open(
      FormLimiteDiariaComponent,
      {
        size: 'sm', // Tamanho pequeno do modal
        centered: true, // Centraliza o modal na tela
        keyboard: false, // Desabilita fechar o modal via teclado
      }
    );

    // Passa os dados do limite selecionada para a instancia do modal
    modalRef.componentInstance.limiteDiaria = limite;
    modalRef.componentInstance.tipo = 'maximo';

    // Manipula o evento de fechamento do modal
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        if (resultado.data._id) {
          // Se o limite tiver um _id, remove o limite atual e cria um novo
          this.removerECriarNovoLimite(resultado.data);
        } else {
          // Se o limite n o tiver um _id, cria um novo limite diária
          this.postNovoLimite(resultado.data);
        }
      }

      // Se a solicitação for cancelada, mostra uma mensagem informativa
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
