import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComunicacaoApiTarifarioV1Service } from '../../home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import Swal from 'sweetalert2';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { NgbDropdownModule, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../../home/dashboard/services/tarifario-comunicacao-entre-componentes-v1.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormTarifarioComponent } from './components/form-tarifario/form-tarifario.component';
import { TarifarioV1Model } from './models/tarifario-v1.model';

@Component({
  selector: 'app-tarifario-gestao',
  templateUrl: './tarifario-gestao.component.html',
})
export class TarifarioGestaoComponent implements OnInit {
  // variáveis de ambiente
  listasTarifario: {
    todos: TarifarioV1Model[],
    excluidos: TarifarioV1Model[],
    validos: TarifarioV1Model[],
    ativos: TarifarioV1Model[],
    desativados: TarifarioV1Model[],
    filtrado: TarifarioV1Model[],
    tipoTabela: string
  } = {
      todos: [],
      excluidos: [],
      validos: [],
      ativos: [],
      desativados: [],
      filtrado: [],
      tipoTabela: ''
    };

  //variáveis paginação
  paginaAtual = 1;

  constructor(
    private comunicacaoComApi: ComunicacaoApiTarifarioV1Service,
    private comunicacaoEntreComponentes: TarifarioComunicacaoEntreComponentesV1Service,
    private mensagemToastr: MensagemToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  /**
   * Hook de ciclo de vida chamado após as propriedades de dados serem inicializadas.
   * Inicializa o componente recuperando a lista de tarifários.
   */
  ngOnInit(): void {
    // Recupera a lista de tarif rios da API
    this.getListaTarifarios();
  }
  /**
   * Recupera todos os tarifários da API e organiza em 5 listas:
   * 1. todos: todos os tarifários
   * 2. excluidos: apenas os tarifários excluídos
   * 3. validos: apenas os tarifários válidos/habilitados
   * 4. desativados: apenas os tarifários desativados
   * 5. ativos: apenas os tarifários ativos
   * 
   * @returns {Promise<void>}
   */
  async getListaTarifarios(): Promise<void> {
    this.loaderService.startLoader();

    try {
      // Recupera todos os tarifários
      const resultado = await lastValueFrom(this.comunicacaoComApi.getTarifarioAdtur());

      // Organiza a lista de tarifários em 5 listas:
      this.listasTarifario.todos = resultado.data;
      this.listasTarifario.excluidos = this.listasTarifario.todos.filter(
        tarifario => tarifario.excluded
      );
      this.listasTarifario.validos = this.listasTarifario.todos.filter(
        tarifario => !tarifario.excluded
      );
      this.listasTarifario.desativados = this.listasTarifario.todos.filter(
        tarifario => !tarifario.actived && !tarifario.excluded
      );
      this.listasTarifario.ativos = this.listasTarifario.todos.filter(
        tarifario => tarifario.actived
      );

      // filtrado: a lista sendo visualizada no momento
      this.listasTarifario.filtrado = this.listasTarifario.validos;

    } catch (error) {
      // Lida com erros HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error: ', error);
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }


  /**
   * Mostra uma mensagem de confirmação antes de excluir um tarifário.
   * 
   * @param tarifario O tarifário a ser excluído.
   */
  alertaExcluirTarifario(tarifario: TarifarioV1Model) {
    // Mostra mensagem de confirmação
    Swal.fire({
      title: 'Excluir tarifário?',
      text: `Tem certeza que deseja excluir o tarifário ${tarifario.nomeTarifario}?`,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'Sim',
      showCancelButton: true,
      cancelButtonText: 'Não',
    }).then((result) => {
      // Se confirmado, exclui o tarifário
      if (result.isConfirmed) {
        this.excluiOuRestauraTarifario(tarifario, true);
      }
    })
  }

  /**
   * Exclui um tarifário.
   * 
   * @param {{ _id: string }} tarifario - O tarifário a ser excluído.
   * @param {boolean} isExcluir - Se é para excluir (true) ou restaurar (false) o tarifário.
   * @returns {Promise<void>}
   */
  async excluiOuRestauraTarifario({ _id }: { _id: string }, isExcluir: boolean): Promise<void> {
    try {
      const data = {
        _id: _id,
        excluded: isExcluir
      }

      // Se for excluir, desativa o tarifário
      if (isExcluir) {
        this.ativaOuDesativaTarifario({ _id }, false);
      } else {
        this.listasTarifario.tipoTabela = 'validos';
      }

      // Envia a requisição de exclusão ou restauração
      const resultado = await lastValueFrom(this.comunicacaoComApi.excluiOuHabilitaTarifario(data))

      // Mostra mensagem de confirmação
      this.mensagemToastr.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? "success" : "error"
      )

      // Atualiza a lista de tarifários
      this.getListaTarifarios();
    } catch (error) {
      // Lida com erros HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error)
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Mostra uma mensagem de confirmação para desativar o tarifário.
   * Se confirmado, desativa o tarifário.
   * @param {TarifarioV1Model} tarifario - O tarifário a ser desativado.
   * @returns {void}
   */
  alertaDesativarTarifario(tarifario: TarifarioV1Model) {
    // Mostra mensagem de confirmação
    Swal.fire({
      title: 'Desativar tarifário?',
      text: `Deseja desativar o tarifário ${tarifario.nomeTarifario}?`,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'Sim',
      showCancelButton: true,
      cancelButtonText: 'Não',
    }).then((result) => {
      // Se confirmado, desativa o tarifário
      if (result.isConfirmed) {
        this.ativaOuDesativaTarifario(tarifario, false);
      }
    })
  }

  /**
   * Ativa ou desativa um tarifário.
   * Mostra uma mensagem de confirmação se a operação for bem sucedida.
   * Se houver um erro, lida com ele e mostra uma mensagem de erro.
   * @param {{ _id: string }} - O objeto com o ID do tarifário.
   * @param {boolean} isAtivar - Se o tarifário deve ser ativado (true) ou desativado (false).
   * @returns {void}
   */
  async ativaOuDesativaTarifario({ _id }: { _id: string }, isAtivar: boolean) {
    this.loaderService.startLoader();
    try {
      const data = {
        _id: _id,
        actived: isAtivar
      }

      const resultado = await lastValueFrom(this.comunicacaoComApi.ativaOuDesativaTarifario(data))

      this.mensagemToastr.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? "success" : "error"
      )

      this.getListaTarifarios();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error)
      }
    } finally {
      this.loaderService.stopLoader()
    }
  }

  /**
   * Redireciona para a página de tarifas do tarifário se o mesmo possuir tarifas,
   * ou para a página de cadastro de tarifas se o mesmo não possuir.
   * @param {TarifarioV1Model} - O tarifário a ser verificado.
   * @returns {void}
   */
  verTarifas(tarifario: TarifarioV1Model, acao: string) {
    switch (acao) {
      case 'ver':
        this.router.navigate(['/dashboard/tarifario', tarifario._id]);
        this.comunicacaoEntreComponentes.emitirTarifarioSelecionado(tarifario);
        break;
      default:
        this.router.navigate(['/reservas/gestao-tarifario/tarifas', tarifario._id])
        break;
    }
  }

  /**
   * Abre o modal para cadastrar um novo tarifário.
   * 
   * @returns {void}
   */
  abrirModalCadastrarTarifario() {
    const modalRef = this.modalService.open(
      FormTarifarioComponent,
      {
        size: 'md',
        centered: true,
        backdrop: 'static',
        modalDialogClass: "modal-dialog",
      }
    )

    modalRef.closed.subscribe(
      (resultado: ResultV1Model) => {
        /**
         * Exibe uma mensagem de sucesso ou erro com base no resultado da API.
         * Se o resultado for positivo, redireciona para a página de cadastro de tarifas.
         * 
         * @param {ResultV1Model} resultado - O resultado da API.
         */
        this.mensagemToastr.show(
          resultado!.message,
          resultado!.titulo,
          resultado!.success ? "success" : "info"
        )

        if (resultado!.success) {
          this.router.navigate(['/reservas/gestao-tarifario/tarifas', resultado!.data._id])
        }
      }
    )
  }

  /**
   * Retorna o status de um determinado 'tarifario'.
   * 
   * @param {TarifarioV1Model} tarifario - O 'tarifario' para determinar o status.
   * @returns {string} - O status do 'tarifario': 'Excluído', 'Ativo', ou 'Desativado'.
   */
  definirStatus(tarifario: TarifarioV1Model): string {
    // Verifica se o tarifario está excluído
    if (tarifario.excluded) {
      return 'Excluído';
    }
    // Verifica se o tarifario está ativo
    else if (tarifario.actived) {
      return 'Ativo';
    }
    // Se não estiver excluído ou ativo, é considerado desativado
    else {
      return 'Desativado';
    }
  }

  /**
   * Retorna a classe CSS apropriada para o status de um 'tarifario'.
   * 
   * @param {TarifarioV1Model} tarifario - O 'tarifario' para determinar a classe.
   * @returns {string} - A classe CSS correspondente ao status: 'badge-danger', 'badge-success', ou 'badge-warning'.
   */
  definirStatusClasse(tarifario: TarifarioV1Model): string {
    // Verifica se o tarifario está excluído
    if (tarifario.excluded) {
      return 'badge-danger';
    }
    // Verifica se o tarifario está ativo
    else if (tarifario.actived) {
      return 'badge-success';
    }
    // Se não estiver excluído ou ativo, é considerado desativado
    else {
      return 'badge-warning';
    }
  }

  /**
   * Filtra a tabela de tarifários com base no tipo de filtro.
   * 
   * @param {string} tipo - O tipo de filtro:
   *   - "" (vazio): lista todos os tarifários;
   *   - "validos": lista apenas os tarifários ativos;
   *   - "ativos": lista apenas os tarifários ativos;
   *   - "desativados": lista apenas os tarifários desativados;
   *   - "excluidos": lista apenas os tarifários excluídos.
   * @returns {void}
   */
  montaTabela(tipo: string) {
    switch (tipo) {
      default:
        // Se o tipo for vazio, lista todos os tarifários.
        this.listasTarifario.filtrado = this.listasTarifario.todos;
        this.listasTarifario.tipoTabela = "";
        break;
      case "validos":
        // Se o tipo for "validos", lista apenas os tarifários ativos.
        this.listasTarifario.tipoTabela = "validos";
        this.listasTarifario.filtrado = this.listasTarifario.validos;
        break;
      case "ativos":
        // Se o tipo for "ativos", lista apenas os tarifários ativos.
        this.listasTarifario.tipoTabela = "ativos";
        this.listasTarifario.filtrado = this.listasTarifario.ativos;
        break;
      case "desativados":
        // Se o tipo for "desativados", lista apenas os tarifários desativados.
        this.listasTarifario.tipoTabela = "desativados";
        this.listasTarifario.filtrado = this.listasTarifario.desativados;
        break;
      case "excluidos":
        // Se o tipo for "excluidos", lista apenas os tarifários excluídos.
        this.listasTarifario.tipoTabela = "excluidos";
        this.listasTarifario.filtrado = this.listasTarifario.excluidos;
        break;
    }
  }
}
