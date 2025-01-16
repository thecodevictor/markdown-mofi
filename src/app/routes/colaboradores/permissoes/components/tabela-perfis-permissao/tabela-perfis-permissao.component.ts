import { Component } from '@angular/core';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { RulesAccountV1Model } from '../../models/rules-account-v1.model';
import { ComunicacaoApiPermissoesV1Service } from '../../services/comunicacao-api-permissoes-v1.service';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComunicacaoComponentesPermissoesService } from '../../services/comunicacao-componentes-permissoes.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { RulesReservasV1Model } from '../../models/rules-reservas-v1.model';
import { RulesColaboradorV1Model } from '../../models/rules-colaborador-v1.model';

@Component({
  selector: 'app-tabela-perfis-permissao',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgbTooltipModule,
  ],
  templateUrl: './tabela-perfis-permissao.component.html',
  styles: ``
})
export class TabelaPerfisPermissaoComponent {
  listaPermissoes: RulesAccountV1Model[] = [];
  paginaAtual = 1;
  $unsubscribe = new Subject<void>();


  /**
   * Construtor do componente.
   * Realiza as seguintes ações:
   * 1. Inscreve-se para receber a ação sendo realizada via observable e executa a lógica para cada ação.
   *    Se a ação for de 'lista', chama o método `getListaPermissoes`.
   * 2. Inicializa o método `getListaPermissoes` para obter a lista de permiss es.
   * @param comunicacaoComApi - Servi o de comunica o com a API.
   * @param comunicacaoEntreComponentes - Servi o de comunica o entre os componentes.
   * @param mensagemToastrService - Servi o de mensagens via toastr.
   * @param loaderService - Servi o de loader.
   */
  constructor(
    private comunicacaoComApi: ComunicacaoApiPermissoesV1Service,
    public comunicacaoEntreComponentes: ComunicacaoComponentesPermissoesService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService
  ) {
    /**
     * Inscreve-se para receber a ação sendo realizada via observable e executa a lógica para cada ação.
     * Se a ação for de 'lista', chama o método `getListaPermissoes`.
     */
    this.comunicacaoEntreComponentes._acaoSendoRealizada
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(acao => {
        if (acao == 'lista') {
          this.getListaPermissoes();
        }
      });
  }

  /**
   * Método chamado quando o componente é destruído.
   * Realiza as seguintes ações:
   * 1. Emite um valor para o observable `$unsubscribe` para indicar que o componente foi destruído.
   * 2. Completa o observable `$unsubscribe` para evitar que ele continue emitindo valores.
   */
  ngOnDestroy(): void {
    // Emite um valor para o observable `$unsubscribe` para indicar que o componente foi destruído.
    this.$unsubscribe.next();

    // Completa o observable `$unsubscribe` para evitar que ele continue emitiindo valores.
    this.$unsubscribe.complete();
  }

  /**
   * Obtém todas as permissões de acesso
   * existentes na base de dados
   */
  async getListaPermissoes() {
    this.loaderService.startLoader();
    try {
      // Faz uma requisição GET para a API para obter todas as permissões
      const resultado = await lastValueFrom(this.comunicacaoComApi.getTodasPermissoes());

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
   * Retorna um objeto com o status da permissão e a cor correspondente
   * @param permissao Permissão a ser verificada
   * @returns Um objeto com o status da permissão e a cor correspondente
   */
  visualizarStatusPermissao(permissao: RulesAccountV1Model): { status: string, cor: string } {
    if (permissao.actived) {
      // Se a permissão est  ativa, retorna um objeto com o status "Ativado" e a cor "success"
      return {
        status: 'Ativado',
        cor: 'success'
      }
    } else {
      // Se a permissão est  desativada, retorna um objeto com o status "Desativado" e a cor "danger"
      return {
        status: 'Desativado',
        cor: 'danger'
      }
    }
  }

  /**
   * Analisa quais módulos estão abrangidos por uma permissão
   * @param permissao Permissão a ser analisada
   * @returns Um array com os módulos abrangidos
   */
  avaliarModulosAbrangidos(permissao: RulesAccountV1Model): string[] {
    const modulos = [];

    // Verifica se o módulo Colaboradores est  abrangido
    if (permissao.isRulesColaborador) {
      modulos.push('Colaboradores');
    }

    // Verifica se o módulo Reservas est  abrangido
    if (permissao.isRulesReservas) {
      modulos.push('Reservas');
    }

    return modulos;
  }

  /**
   * Retorna um objeto que contém as informações de um módulo abrangido por uma permissão
   * @param modulo O módulo a ser analisado
   * @returns Um objeto com a informa o do módulo abrangido
   */
  visualizarModulosAbrangidos(modulo: string) {
    switch (modulo) {
      // Caso o módulo seja Colaboradores
      case 'Colaboradores':
        return {
          modulo: 'Colaboradores',
          cor: 'primary' // Cor do bagde módulo
        }
      // Caso o módulo seja Reservas
      case 'Reservas':
        return {
          modulo: 'Reservas',
          cor: 'secondary' // Cor do bagde módulo
        }
      // Caso o módulo não seja reconhecido
      default:
        return {}
    }
  }

  /**
   * Ativa ou desativa um perfil de permissão
   * @param permissao Perfil a ser ativado/desativado
   */
  async ativarDesativarPerfilPermissao(permissao: RulesAccountV1Model) {
    this.loaderService.startLoader();
    const dadosAEnviar = {
      id: permissao._id!,
      actived: !permissao.actived
    }

    try {
      const resultado = await lastValueFrom(this.comunicacaoComApi.putAtivarDesativarPerfil(dadosAEnviar));

      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      );

      // Atualiza a lista de permissões
      this.getListaPermissoes();
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Abre o formulário de edição de perfil com as informações da permissão
   * @param permissao Permissão a ser editada
   */
  abrirFormularioPerfil(permissao?: RulesAccountV1Model) {
    if (permissao) {
      // Emite que a ação atual é a de edição
      this.comunicacaoEntreComponentes.emitirAcaoSendoRealizada('edicao');
      // Emite a permissão a ser editada
      this.comunicacaoEntreComponentes.emitirPermissaoSelecionada(permissao);
      this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloColaborador(permissao._rulesColaborador)
      this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloReservas(permissao._rulesReservas)
    } else {
      // Emite que a ação atual é a de cadastro
      this.comunicacaoEntreComponentes.emitirAcaoSendoRealizada('cadastro');
      // Emite as permissões padrões
      this.comunicacaoEntreComponentes.emitirPermissaoSelecionada(undefined);
      this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloColaborador(new RulesColaboradorV1Model())
      this.comunicacaoEntreComponentes.emitirPermissoesDefinidasModuloReservas(new RulesReservasV1Model())
    }
  }
}
