import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComunicacaoComponentesPermissoesService } from '../../services/comunicacao-componentes-permissoes.service';
import { ComunicacaoApiPermissoesV1Service } from '../../services/comunicacao-api-permissoes-v1.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { RulesAccountV1Model } from '../../models/rules-account-v1.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormReativoService } from 'src/app/shared/services/form-reativo.service';
import { TabPermissoesModuloColaboradoresComponent } from '../tab-permissoes-modulo-colaboradores/tab-permissoes-modulo-colaboradores.component';
import { TabPermissoesModuloReservasComponent } from '../tab-permissoes-modulo-reservas/tab-permissoes-modulo-reservas.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-perfil-permissao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabPermissoesModuloColaboradoresComponent,
    TabPermissoesModuloReservasComponent,
    NgbTooltipModule
  ],
  templateUrl: './form-perfil-permissao.component.html',
  styles: ``
})
export class FormPerfilPermissaoComponent implements OnDestroy {
  // variáveis de ambiente
  $unsubscribe = new Subject<void>();
  permissaoADefinir!: RulesAccountV1Model;
  moduloSelecionado: string = '';
  formPermissoes: FormGroup;

  /**
   * Construtor do componente.
   * 
   * @param loaderService - Serviço para controlar o loader.
   * @param comunicacaoEntreComponentes - Serviço para comunicar entre os componentes.
   * @param comunicacaComApi - Serviço para comunicar com a API.
   * @param fb - Serviço do Angular para criar formulários.
   * @param formReativoService - Serviço para lidar com formulários reativos.
   */
  constructor(
    private loaderService: LoaderService,
    private comunicacaoEntreComponentes: ComunicacaoComponentesPermissoesService,
    private comunicacaComApi: ComunicacaoApiPermissoesV1Service,
    private fb: FormBuilder,
    public formReativoService: FormReativoService
  ) {
    /*
     * Cria o formulário com as validações iniciais.
     */
    this.formPermissoes = this.fb.group(this.montarForm());

    /*
     * Inscreve-se para receber a permissão que está sendo 
     * selecionada e a armazena na variável `permissaoADefinir`.
     */
    this.comunicacaoEntreComponentes.permissaoSelecionada
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        permissao => {
          if (permissao) {
            this.permissaoADefinir = permissao;
          } else {
            this.permissaoADefinir = new RulesAccountV1Model();
          }
        }
      );

    /*
     * Inscreve-se para receber a ação que está sendo realizada e
     * executa a lógica para cada ação.
     */
    this.comunicacaoEntreComponentes.acaoSendoRealizada
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        acao => {
          if (acao == 'edicao') {
            /*
             * Se a ação for de 'edicao', preenche o formulário com as permissões
             * que estão sendo editadas.
             */
            this.preencherForm();
          }
        }
      );

    /*
     * Inscreve-se para receber as permissões definidas para o módulo
     * Colaboradores e armazena na variável `permissoesColaboradores`.
     */
    this.comunicacaoEntreComponentes.permissoesDefinidasModuloColaborador
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(permissoes => {
        if (permissoes) {
          this.permissaoADefinir._rulesColaborador = permissoes;
        }
      })

    /*
     * Inscreve-se para receber as permissões definidas para o módulo
     * Reservas e armazena na variável `permissoesReservas`.
     */
    this.comunicacaoEntreComponentes.permissoesDefinidasModuloReservas
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(permissoes => {
        if (permissoes) {
          this.permissaoADefinir._rulesReservas = permissoes;
        }
      })
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  montarForm() {
    return {
      nomePerfil: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(60)
        ])
      ],

    }
  }

  /**
   * Preenche o formulário com os dados da permissão que foi recebida como parâmetro.
   */
  preencherForm() {
    // Preenche o campo de nome do perfil com o valor da permissão recebida
    this.formPermissoes.controls['nomePerfil'].setValue(this.permissaoADefinir?.namePerfil);
  }

  /**
   * Seleciona o módulo que o usuário deseja gerenciar as permissões e emite os dados das permissões
   * para os componentes filhos.
   * 
   * @param modulo O módulo que o usuário deseja gerenciar as permissões. 
   * Valores possíveis: 'colaboradores' ou 'reservas'.
   */
  selecionarModulo(modulo: 'colaboradores' | 'reservas') {
    this.moduloSelecionado = modulo;

    // Verifica se a permissão que foi recebida como parâmetro tem dados
    if (this.permissaoADefinir) {
      switch (modulo) {
        case 'colaboradores':
          // Emite as permissões do módulo Colaboradores para os componentes filhos
          this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloColaborador(
            this.permissaoADefinir._rulesColaborador
          )
          break;
        case 'reservas':
          // Emite as permissões do módulo Reservas para os componentes filhos
          this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloReservas(
            this.permissaoADefinir._rulesReservas
          )
          break;
      }
    }
  }

  /**
   * Verifica se o botão de salvar deve estar desabilitado.
   * 
   * @returns {boolean} True se o botão de salvar deve estar desabilitado, false caso contrário.
   */
  desabilitarBotaoSalvar(): boolean {
    // Verifica se o formulário é vélido e se não está "pristino" (não foi alterado)
    const formularioInvalido = this.formPermissoes.invalid;

    // Verifica se não há permissões definidas em nenhum dos módulos
    const permissoesEmModulosUndefined = (this.permissaoADefinir._rulesColaborador || this.permissaoADefinir._rulesReservas) ? false : true;

    // Se o formulário é válido ou não tem permissões em nenhum dos módulos, desabilita o botão de salvar
    return formularioInvalido || permissoesEmModulosUndefined;
  }

  /**
   * Asynchronously saves the profile permissions.
   * It updates the permission details and communicates with the API to save the profile.
   * Displays success or error messages based on the result.
   */
  async salvarPerfil() {
    // Start the loader to indicate a process is running
    this.loaderService.startLoader();

    try {
      // Set the profile name from the form input
      this.permissaoADefinir.namePerfil = this.formPermissoes.get('nomePerfil')?.value;

      // Check and update collaborator rules
      if (this.permissaoADefinir._rulesColaborador) {
        this.permissaoADefinir.isRulesColaborador = true;
      }

      // Check and update reservation rules
      if (this.permissaoADefinir._rulesReservas) {
        this.permissaoADefinir.isRulesReservas = true;
      }

      // Make API call to save the new profile permission
      const resultado = await lastValueFrom(this.comunicacaComApi.postNovoPerfilPermissao(this.permissaoADefinir));

      // If the result is successful, emit action to return to list view
      if (resultado.success) {
        this.comunicacaoEntreComponentes.emitirAcaoSendoRealizada('lista');
      }

      // Show success or error message based on the API result
      Swal.fire(
        resultado.titulo,
        resultado.message,
        resultado.success ? 'success' : 'error'
      )
    } catch (error) {
      // If an error occurs, handle it appropriately
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error');
        console.log(error);
      }
    } finally {
      // Stop the loader after the operation is complete
      this.loaderService.stopLoader();
    }
  }
}
