import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { NewAccountColaboradorV1Model } from '../../../models/new-account-colaborador-v1.model';
import { ComunicacaoApiGestaoContasV1Service } from '../../../services/comunicacao-api-gestao-contas-v1.service';
import { lastValueFrom } from 'rxjs';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { RulesAccountV1Model } from '../../../permissoes/models/rules-account-v1.model';
import { ComunicacaoApiPermissoesV1Service } from '../../../permissoes/services/comunicacao-api-permissoes-v1.service';
import { FormReativoService } from 'src/app/shared/services/form-reativo.service';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { AccountV1Model } from 'src/app/_core/models/account-v1.model';
import { UpdateAccountColaboradorV1Model } from '../../../models/update-account-colaborador-v1.model';
import { ComunicacaoApiGestaoOutrosPerfisService } from '../../../services/comunicacao-api-gestao-outros-perfis.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ComunicacaoApiPermissoesV1Service
  ],
  templateUrl: './form-usuario.component.html',
  styles: ``
})
export class FormUsuarioComponent implements OnInit {
  //variáveis de ambiente
  userLogado: AccountAccessV1Model | null;
  formUsuario: FormGroup;
  listaPermissoes: RulesAccountV1Model[] = [];

  // variáveis a serem atualizadas na chamada do modal
  perfilAEditar: AccountV1Model;

  constructor(
    private fb: FormBuilder,
    private modalAtivo: NgbActiveModal,
    private loaderService: LoaderService,
    private comunicacaoApiGestaoContasService: ComunicacaoApiGestaoContasV1Service,
    private comunicacaoApiGestaoOutrosPerfis: ComunicacaoApiGestaoOutrosPerfisService,
    public formReativo: FormReativoService,
    private comunicacaoApiPermissoes: ComunicacaoApiPermissoesV1Service
  ) {
    this.userLogado = SecurityUtil.getAccount();
    this.formUsuario = this.fb.group(this.montarFormNovoUsuario());
  }

  ngOnInit(): void {
    this.getListaPermissoes();
    this.finalizandoDefinicoesDoForm();
  }

  montarFormNovoUsuario() {
    return {
      apelido: [
        '',
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(10),
          Validators.required
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.email,
          Validators.required
        ])],
      telefone: [
        '',
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.required
        ])],
      perfilPermissao: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    };
  }

  /**
   * Finaliza as definições do formulário
   * com base se o perfil a editar foi informado
   * ou não.
   * Se o perfil a editar for informado, adiciona o controle para o nome
   * e remove o controle da senha.
   * Além de preencher os demais controles com os dados do perfilAEditar
   * Se for um novo cadastro, adiciona o controle para a senha e remove o controle do nome.
   */
  finalizandoDefinicoesDoForm() {
    if (this.perfilAEditar) {
      console.log('this.perfilAEditar')
      console.log(this.perfilAEditar)

      // Adiciona o controle para o nome e remove o controle da senha.
      // Al m de preencher os demais controles com os dados do perfilAEditar
      this.formReativo.addControlsToForm(
        this.formUsuario,
        this.perfilAEditar.nome ?? '',
        [
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.required,
        ],
        'nome'
      )

      this.formReativo.removeControlsFromForm(this.formUsuario, 'accesskey');

      this.formUsuario.patchValue({
        apelido: this.perfilAEditar._user.apelido.replace('(eu)', '').trim(),
        email: this.perfilAEditar._user.email,
        telefone: this.perfilAEditar.telefone ?? '',
        perfilPermissao: this.perfilAEditar._rulesAccount?._id ?? ''
      })
    } else {
      // Adiciona o controle para a senha e remove o controle do nome.
      this.formReativo.addControlsToForm(
        this.formUsuario,
        '',
        [
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.required,
        ],
        'accesskey'
      )
      this.formReativo.removeControlsFromForm(this.formUsuario, 'nome');
    }
  }


  /**
   * Faz a submissão do formulário
   * de cadastro/edição de perfil de colaborador.
   * Se o perfil a editar for informado, atualiza o perfil,
   * caso contrário, cria um novo perfil.
   * 
   * O perfil a editar é informado na chamada do modal, ao clicar
   * em editar um perfil, na tabela de contas web
   */
  async salvar() {
    this.loaderService.startLoader();
    let dadosAAtualizar: NewAccountColaboradorV1Model | UpdateAccountColaboradorV1Model;
    let resultado: ResultV1Model;

    try {
      if (this.perfilAEditar) {
        // Atualiza o perfil
        dadosAAtualizar = new UpdateAccountColaboradorV1Model(
          this.perfilAEditar._id,
          this.perfilAEditar._user._id,
          this.formUsuario.controls['nome'].value,
          this.formUsuario.controls['telefone'].value,
          this.formUsuario.controls['apelido'].value,
          this.formUsuario.controls['perfilPermissao'].value,
        );
        resultado = await lastValueFrom(
          this.comunicacaoApiGestaoOutrosPerfis.putUpdateAtualizarContaOutrosPerfis(
            dadosAAtualizar
          )
        );
      } else {
        // Cria um novo perfil
        dadosAAtualizar = new NewAccountColaboradorV1Model(
          this.formUsuario.controls['apelido'].value,
          this.formUsuario.controls['email'].value,
          this.formUsuario.controls['telefone'].value,
          this.formUsuario.controls['accesskey'].value,
          true,
          this.formUsuario.controls['perfilPermissao'].value
        );

        resultado = await lastValueFrom(
          this.comunicacaoApiGestaoContasService.postNovaConta(dadosAAtualizar)
        );
      }
      this.modalAtivo.close(resultado);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error', error);
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Obtém todas as permissões de acesso
   * existentes na base de dados
   */
  async getListaPermissoes() {
    this.loaderService.startLoader();
    try {
      // Faz uma requisição GET para a API para obter todas as permissões
      const resultado = await lastValueFrom(this.comunicacaoApiPermissoes.getTodasPermissoes());

      if (resultado.success) {
        // Se a resposta for bem sucedida, atribui a lista de permissões
        // para a variável de instância "listaPermissoes"
        this.listaPermissoes = resultado.data;
      }
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Fecha o modal de cadastro de novo usuário
   */
  fecharModal() {
    // Fecha o modal e retorna um objeto ResultV1Model
    // com informações sobre o cancelamento da criação do usuário
    this.modalAtivo.close(
      new ResultV1Model(
        false, // Success
        'Novo usuário', // Titulo
        'A criação do usuário foi cancelada.', // Mensagem
        null, // Data
        null // Errors
      )
    );
  }

  abrirModalAlterarSenha() {

  }

  abrirModalAlterarAvatar() {

  }
}
