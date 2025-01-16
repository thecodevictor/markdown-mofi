import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeaderUserService } from 'src/app/_core/services/headeruser.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { lastValueFrom } from 'rxjs';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { ComunicacaoApiPermissoesV1Service } from '../../permissoes/services/comunicacao-api-permissoes-v1.service';
import { RulesAccountV1Model } from '../../permissoes/models/rules-account-v1.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { ComunicacaoApiGestaoMeuPerfilService } from '../../services/comunicacao-api-gestao-meu-perfil.service';
import { FormReativoService } from 'src/app/shared/services/form-reativo.service';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { AccountV1Model } from 'src/app/_core/models/account-v1.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlterarSenhaMeuPerfilComponent } from '../modal-alterar-senha-meu-perfil/modal-alterar-senha-meu-perfil.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-edit-meu-perfil',
  templateUrl: './edit-meu-perfil.component.html',
  standalone: false
})
export class EditMeuPerfilComponent implements OnInit {
  // Variaveis de ambiente
  contaEditavel: any;
  form: FormGroup
  listaPermissoes: RulesAccountV1Model[] = [];

  @Output() retornarAosDetalhes: EventEmitter<ResultV1Model> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private headerService: HeaderUserService,
    private loaderService: LoaderService,
    private readonly comunicacaoApiGestaoMeuPerfil: ComunicacaoApiGestaoMeuPerfilService,
    private modalService: NgbModal,
    public formReativoService: FormReativoService,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.contaEditavel = SecurityUtil.getAccount();

    this.form = this.fb.group({
      apelido: [
        '',
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(10),
          Validators.required
        ])
      ],
      email: [
        ''
      ],
      nome: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.required
        ])
      ],
      telefone: [
        '',
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.required
        ])
      ]
    });
  }

  ngOnInit(): void {
    this.form.setValue({
      apelido: this.contaEditavel?.apelido,
      email: this.contaEditavel?.email,
      nome: this.contaEditavel?.nome,
      telefone: this.contaEditavel?.telefone,
    })

    //desabilita a edição do campo email*/
    this.form.controls['email'].disable();
  }

  abrirModalAlterarSenha() {
    const modalRef = this.modalService.open(
      ModalAlterarSenhaMeuPerfilComponent,
      {
        size: 'sm',
        backdrop: 'static',
        keyboard: false
      }
    )

    modalRef.componentInstance.meuUsuario = this.contaEditavel;
    modalRef.closed.subscribe(textoRetornado => {
      if (textoRetornado == 'Alteração de senha cancelada') {
        this.mensagemToastrService.show(
          '',
          textoRetornado,
          'info'
        )
      } else {
        this.atualizarMinhaSenha(textoRetornado);
      }
    })
  }

  /**
   * Atualiza o perfil do usuário logado.
   * @returns void
   */
  async atualizarPerfil() {
    this.loaderService.startLoader();

    // Esse é model que é aceito pela API!
    const dadosAAtualizar: {
      nome: string,
      telefone: string,
      apelido: string,
    } = {
      apelido: this.form.value['apelido'],
      nome: this.form.value['nome'],
      telefone: this.form.value['telefone'],
    };

    try {
      // Chama a API para atualizar o perfil
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoMeuPerfil.putUpdateConta(dadosAAtualizar)
      ) as ResultV1Model;

      //Verifica o retorno do serviço
      if (resultado.success) {
        // Atualiza o perfil do usuário no localStorage
        const account = resultado.data as AccountV1Model;

        const accountAccess = new AccountAccessV1Model(
          account._user.apelido,
          account.nome,
          account.telefone,
          account._user.email,
          account._avatar,
          account._user.lock,
          account._user.rulesUser,
          account._idAccount,
        )

        //Atualiza o setAccount localstorage
        SecurityUtil.setAccount(accountAccess);

        // Dispara o evento de alterado no perfil
        this.headerService.userAlterdoEvent();
      }

      // Dispara o evento de atualização na tela
      this.retornarAosDetalhes.emit(resultado);
    } catch (error) {
      // Trata o erro de acordo com o tipo de erro
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      }
    } finally {
      // Para o loader de carregamento
      this.loaderService.stopLoader();
    }
  }


  /**
   * Atualiza a senha do perfil do usuário logado.
   * @param {string} novaSenha Nova senha do perfil.
   * @returns {Promise<void>}
   */
  async atualizarMinhaSenha(novaSenha: string) {
    this.loaderService.startLoader();

    try {
      // Chama a API para atualizar a senha
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoMeuPerfil.putAtualizarSenha(novaSenha)
      ) as ResultV1Model;

      // Verifica o retorno do serviço
      if (resultado.success) {
        // Mostra mensagem de sucesso
        this.mensagemToastrService.show(
          'Senha atualizada com sucesso!',
          'Alteração de senha',
          'success'
        );
      } else {
        // Mostra mensagem de erro
        this.mensagemToastrService.show(
          resultado.message,
          'Alteração de senha',
          'error'
        );
      }
    } catch (error) {
      // Trata o erro de acordo com o tipo de erro
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error);
      }
    } finally {
      // Para o loader de carregamento
      this.loaderService.stopLoader();
    }
  }

  /**
   * Cancela a edição do perfil e dispara um evento
   * com resultado false e mensagem de cancelamento
   */
  cancelarEdicao() {
    // Cria um objeto ResultV1Model com resultado false e mensagem
    const resultado = new ResultV1Model(
      false,
      'Alterações no perfil canceladas.',
      '',
      null,
      null
    );

    // Dispara o evento de cancelamento na tela
    this.retornarAosDetalhes.emit(resultado);
  }
}
