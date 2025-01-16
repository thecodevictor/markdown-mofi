import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { AccountV1Model } from 'src/app/_core/models/account-v1.model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { UserV1Model } from 'src/app/_core/models/user-v1.model';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { ActiveAndDisabledAccountV1Model } from '../models/active-and-disabled-account-v1.model';
import { RemoveAccountAndUserModel } from '../models/remove-account-and-user.model';
import { PerfilEditavelUtil } from '../services/perfil-editavel.util';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormUsuarioComponent } from './components/form-usuario/form-usuario.component';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { ComunicacaoApiGestaoContasV1Service } from '../services/comunicacao-api-gestao-contas-v1.service';

@Component({
  selector: 'app-contas-web',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgbTooltipModule
  ],
  templateUrl: './contas-web.component.html',
  styles: ``
})
export class ContasWebComponent implements OnInit {

  /**
   * variaveis de ambiente
   */
  paginaAtual: number = 1;
  userlogado: AccountAccessV1Model | null;
  listaUsuariosFiltrada: AccountV1Model[] = [];
  listaTodosUsuarios: AccountV1Model[] = [];
  listaUsuariosAtivos: AccountV1Model[] = [];
  listaUsuariosDesativados: AccountV1Model[] = [];
  listaUsuariosExcluidos: AccountV1Model[] = [];
  labelFiltroAtual: string;

  constructor(
    private modalService: NgbModal,
    private route: Router,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private comunicacaoApiGestaoContasService: ComunicacaoApiGestaoContasV1Service,
  ) {
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getListaContas();
  }

  /**
   * Retorna um objeto com o status da conta e a cor correspondente
   * @param user User a ser verificada
   * @returns Um objeto com o status da conta e a cor correspondente
   */
  visualizarStatusTabela(user: UserV1Model): { status: string, cor: string } {
    // Se o usuario está desativado, retorna um objeto com o status "Desativado" e a cor "danger"
    if (user.lock) {
      return {
        status: 'Desativado',
        cor: 'danger'
      }
    } else {
      // Se o usuario está ativo, retorna um objeto com o status "Ativado" e a cor "success"
      return {
        status: 'Ativado',
        cor: 'success'
      }
    }
  }


  /**
   * Ativa a conta de um usuario
   * @param conta Conta a ser ativada
   */
  async ativaConta(conta: AccountV1Model) {
    this.loaderService.startLoader();

    // Cria um objeto com as informacoes necessarias para ativar a conta
    const ativaConta = new ActiveAndDisabledAccountV1Model(
      conta._user._id,
      conta._user._id,
      false,
    );

    try {
      // Realiza a requisicao para ativar a conta
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoContasService.putAtivarEDesativarConta(ativaConta)
      );

      // Se a operacao for bem sucedida, atualiza a lista de contas
      if (resultado.success) {
        this.getListaContas();
      };

      // Mostra uma mensagem ao usuario com o resultado da operacao
      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      );
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error);
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Atualmente, não é possível desativar o perfil dos usuários
   */
  async desativaConta() {
    // TODO: Implementar a logica para desativar a conta
    this.mensagemToastrService.show(
      'Identificamos um erro ao desativar o perfil. Tente mais tarde!',
      'Erro ao desativar perfil',
      'error'
    )
  }

  async removerOuRestaurarPerfil(perfil: AccountV1Model) {
    const account: RemoveAccountAndUserModel = {
      _idaccount: perfil._id,
      _iduser: perfil._user._id,
      excluded: !perfil.excluded
    }

    this.loaderService.startLoader();

    try {
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoContasService.deleteAccountPerfil(account)
      )

      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      );

    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error);
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Busca a lista de contas de usuários e as categoriza em listas de ativos, desativados e excluídos.
   * Inicia um indicador de carregamento no início da operação e o para após a conclusão.
   * Se o e-mail do usuário logado corresponder a alguma conta, adiciona "(eu)" ao apelido.
   * Exibe uma mensagem se a chamada à API falhar.
   */
  async getListaContas() {
    // Inicializa as listas de usuários
    this.listaUsuariosFiltrada = [];
    this.listaTodosUsuarios = [];
    this.listaUsuariosAtivos = [];
    this.listaUsuariosDesativados = [];
    this.listaUsuariosExcluidos = [];

    // Inicia o Loader
    this.loaderService.startLoader();

    try {
      // Busca contas da API
      const resultado = await lastValueFrom(this.comunicacaoApiGestaoContasService.getListaContas());

      if (resultado.success) {
        // Categoriza usuários com base em seu status
        resultado.data.forEach((element: AccountV1Model) => {
          if (element._user.email === this.userlogado?.email) {
            element._user.apelido += ' (eu)';
          }
          if (element.excluded) {
            this.listaUsuariosExcluidos.push(element);
          } else {
            this.listaTodosUsuarios.push(element);
            if (!element._user.lock) {
              this.listaUsuariosAtivos.push(element);
            }
            if (element._user.lock) {
              this.listaUsuariosDesativados.push(element);
            }
          }
        });

        // Atualiza a lista filtrada com todos os usuários
        this.definirFiltroDaLista('');
      } else {
        // Mostra mensagem de erro se a chamada à API não for bem-sucedida
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          'error'
        );
      }
    } catch (error) {
      // Trata erros da chamada à API
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('erro');
        console.log(error);
      }
    } finally {
      // Para o Loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Define o filtro da lista de usuários com base no tipo de filtro fornecido.
   * Atualiza a lista de usuários filtrada e o rótulo do filtro atual.
   * @param filtro O tipo de filtro a ser aplicado ('ativados', 'desativados', 'excluidos', ou outro).
   */
  definirFiltroDaLista(filtro: string) {
    // Inicializa a lista de usuários filtrados
    this.listaUsuariosFiltrada = [];

    switch (filtro) {
      case 'ativados':
        // Filtra usuários ativos
        this.labelFiltroAtual = 'ativo';
        this.listaUsuariosFiltrada = this.listaUsuariosAtivos;
        break;

      case 'desativados':
        // Filtra usuários desativados
        this.labelFiltroAtual = 'desativado';
        this.listaUsuariosFiltrada = this.listaUsuariosDesativados;
        break;

      case 'excluidos':
        // Filtra usuários excluídos
        this.labelFiltroAtual = 'excluído';
        this.listaUsuariosFiltrada = this.listaUsuariosExcluidos;
        break;

      default:
        // Sem filtro específico, lista todos os usuários
        this.labelFiltroAtual = '';
        this.listaUsuariosFiltrada = this.listaTodosUsuarios;
        break;
    }
  }

  /**
   * Abre o modal de cadastro de novo usuário.
   *
   * @remarks
   * Este método abre o modal de cadastro de novo usuário e
   * retorna um objeto `NgbModalRef` com a referência ao modal.
   * O modal é configurado para ter o tamanho "md" e estar
   * centralizado na tela.
   *
   * Quando o modal é fechado, o método `closed` é executado
   * e recebe como parâmetro o objeto `ResultV1Model` com o
   * resultado da operação.
   * Se o resultado for bem-sucedido, o método `getListaContas`
   * é executado para atualizar a lista de usuários.
   * Em seguida, uma mensagem de feedback é mostrada para o
   * usuário com o resultado da operação.
   * Se o resultado for um erro, a mensagem de erro é
   * mostrada para o usuário.
   */
  abrirModalFormUsuario(perfilAEditar?: AccountV1Model) {
    const modalRef: NgbModalRef = this.modalService.open(
      FormUsuarioComponent,
      {
        keyboard: false,
        centered: true,
        size: 'md',
        modalDialogClass: "modal-dialog"
      }
    );

    modalRef.componentInstance.perfilAEditar = perfilAEditar;

    modalRef.closed.subscribe(
      (resultado: ResultV1Model) => {
        if (resultado.success) {
          // Atualiza a lista de usuários se o cadastro/edição for bem-sucedido
          this.getListaContas();
        }
        // Mostra mensagem de feedback ao usuário
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          resultado.success
            ? 'success'
            : (
              resultado.message.includes('cancelada')
                ? 'info'
                : 'error'
            )
        );
        // Para o Loader
        this.loaderService.stopLoader();
      });
  }
}
