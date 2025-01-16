import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ComunicacaoApiTarifarioV1Service } from 'src/app/routes/home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { TarifarioV1Model } from '../../models/tarifario-v1.model';
import Swal from 'sweetalert2';
import { TarifasV1Model } from '../../models/tarifas-v1.model';
import { TipoUhV1Model } from '../../models/tipo-uh-v1.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import * as dadosFixos from './valores-fixos-tarifas.data';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TarifasComunicacaoApiV1Service } from '../../services/tarifas-comunicacao-api-v1.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { EditarTarifasV1Service } from './services/editar-tarifas-v1.service';
import { CriandoTarifasSemUHEspecificadoV1Service } from './services/criando-tarifas-sem-uh-especificado-v1.service';
import { AdicionandoTarifasDePeriodoEUhEspecificosV1Service } from './services/adicionando-tarifas-de-periodo-e-uh-especificos-v1.service';

@Component({
  selector: 'app-form-tarifas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    CurrencyMaskModule
  ],
  providers: [
    EditarTarifasV1Service,
    CriandoTarifasSemUHEspecificadoV1Service,
    AdicionandoTarifasDePeriodoEUhEspecificosV1Service
  ],
  templateUrl: './form-tarifas.component.html',
  styles: ``
})
export class FormTarifasComponent implements OnInit {
  // variável referente aos parâmetros da url
  urlParams: {
    id_tarifario?: string,
    periodo_tarifa?: string,
    id_tipo_uh?: string
    id_tarifa?: string,
  } = {};

  // variáveis de ambiente
  title: string = ''
  tarifarioSelecionado?: TarifarioV1Model;
  listaTarifas: TarifasV1Model[] = [];
  listaUH: TipoUhV1Model[] = [];
  tarifasDefinidas = {} as TarifasV1Model;
  isCriandoTarifasSemUHPreDefinido = false;
  quartos;
  periodos = [
    {
      label: 'Alta Temporada e Feriados',
      value: 'isAltaTemporadaEFeriados'
    },
    {
      label: 'Domingo à Quinta',
      value: 'isDomingoAQuinta'
    },
    {
      label: 'Quinta à Domingo',
      value: 'isQuintaADomingo'
    }
  ] as Array<{
    label: string,
    value: string
  }>;

  //ngmodels
  nomeTarifario: string;
  nomeUhSelecionada: string = '';
  periodoSelecionado: string;
  valorCafeManha?: string;
  valorPensaoAlmoco?: string;
  valorPensaoJantar?: string;
  valorPensaoCompleta?: string;

  constructor(
    private comunicacaoComApiTarifario: ComunicacaoApiTarifarioV1Service,
    private tarifasComunicacaoApi: TarifasComunicacaoApiV1Service,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    private mensagemToastrService: MensagemToastrService,
    private editarTarifasService: EditarTarifasV1Service,
    private criandoTarifasSemUhEspecificadoService: CriandoTarifasSemUHEspecificadoV1Service,
    private adicionandoTarifasUHePeriodosEspecificosService: AdicionandoTarifasDePeriodoEUhEspecificosV1Service
  ) {
    this.urlParams = this.activatedRoute.snapshot.params;
    this.quartos = dadosFixos.quartos;
  }

  ngOnInit(): void {
    this.getTiposUH();
  }

  /**
   * Monta e retorna a estrutura do formulário de tarifas.
   * 
   * @returns {object} - A estrutura do formulário com controles iniciais.
   */
  montarForm() {
    return {
      // Campo para o nome do tarifário, obrigatório
      tarifario: ['', Validators.required],
      // Campo para o tipo da Unidade Hoteleira, obrigatório
      tipoUh: ['', Validators.required],
      // Campo para o período da tarifa, obrigatório
      periodo: ['', Validators.required],
    }
  }

  /**
   * Evento disparado quando o período da tarifa é alterado.
   * 
   * @param {Event} event - O evento disparado.
   */
  onPeriodoChange(event: string) {
    const selectedPeriodo = event;

    // Verifica se o período foi selecionado
    if (selectedPeriodo) {
      switch (selectedPeriodo) {
        case 'isAltaTemporadaEFeriados':
          this.tarifasDefinidas.isAltaTemporadaEFeriados = true;
          this.tarifasDefinidas.isQuintaADomingo = false;
          this.tarifasDefinidas.isDomingoAQuinta = false;
          break;
        case 'isDomingoAQuinta':
          this.tarifasDefinidas.isDomingoAQuinta = true;
          this.tarifasDefinidas.isAltaTemporadaEFeriados = false;
          this.tarifasDefinidas.isQuintaADomingo = false;
          break;
        case 'isQuintaADomingo':
          this.tarifasDefinidas.isDomingoAQuinta = true;
          this.tarifasDefinidas.isQuintaADomingo = false;
          this.tarifasDefinidas.isAltaTemporadaEFeriados = false;
          break;
      }
    }
    this.inicializarObjTarifasDefinidas();
  }

  /**
   * Preenche o formulário com os dados da tarifa selecionada.
   * 
   * Verifica se o período foi selecionado e, se sim, 
   * preenche o formulário com os dados da tarifa selecionada.
   * 
   * @returns {void}
   */
  preencherForm() {
    this.title = 'Editar Tarifas';

    // Verifica se o período foi selecionado
    if (this.urlParams.periodo_tarifa && this.urlParams.id_tipo_uh) {
      /**
       * Inicializa o componente com os dados do período e da Unidade Hoteleira.
       * 
       * @param {TarifarioV1Model} tarifarioSelecionado - O tarifário selecionado.
       * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa selecionada.
       * @param {string} periodo_tarifa - O período da tarifa.
       * @param {string} id_tipo_uh - O ID da Unidade Hoteleira.
       * @param {Array<TipoUhV1Model>} listaUH - A lista de tipos de Unidades Hoteleiras.
       * @param {Array<{label: string, value: string}>} periodos - A lista de períodos do tarifário.
       * 
       * @returns {
       *   tarifasDefinidas: TarifasV1Model,
       *   nomeUhSelecionada: string,
       *   nomeTarifario: string,
       *   periodoSelecionado: string,
       *   periodos: Array<{label: string, value: string}>
       * }
       */
      const retorno = this.adicionandoTarifasUHePeriodosEspecificosService
        .iniciandoComponenteAdicionandoTarifaDePeriodoEUhEspecifico(
          this.tarifarioSelecionado!,
          this.tarifasDefinidas,
          this.urlParams.periodo_tarifa,
          this.urlParams.id_tipo_uh,
          this.listaUH,
          this.periodos
        );

      this.tarifasDefinidas = retorno.tarifasDefinidas;
      this.periodoSelecionado = retorno.periodoSelecionado;
      this.periodos = retorno.periodos;
      this.nomeTarifario = retorno.nomeTarifario;
      this.nomeUhSelecionada = retorno.nomeUhSelecionada;
    } else if (this.urlParams.id_tarifa) {
      /**
       * Inicializa o componente com os dados da tarifa selecionada.
       * 
       * @param {TarifarioV1Model} tarifarioSelecionado - O tarifário selecionado.
       * @param {string} id_tarifa - O ID da tarifa selecionada.
       * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa selecionada.
       * @param {Array<{label: string, value: string}>} periodos - A lista de períodos do tarifário.
       * 
       * @returns {
       *   tarifasDefinidas: TarifasV1Model,
       *   nomeUhSelecionada: string,
       *   nomeTarifario: string,
       *   periodoSelecionado: string,
       *   periodos: Array<{label: string, value: string}>
       * }
       */
      const retorno = this.editarTarifasService.iniciandoComponenteEditandoUmaTarifaEspecifica(
        this.tarifarioSelecionado!,
        this.urlParams.id_tarifa,
        this.tarifasDefinidas,
        this.periodos
      );

      this.tarifasDefinidas = retorno.tarifasDefinidas;
      this.periodoSelecionado = retorno.periodoSelecionado;
      this.periodos = retorno.periodos;
      this.nomeTarifario = retorno.nomeTarifario;
      this.nomeUhSelecionada = retorno.nomeUhSelecionada;
    } else {
      this.isCriandoTarifasSemUHPreDefinido = true;
      /**
       * Inicializa o componente com os dados do tarifário e da lista de tipos de Unidades Hoteleiras.
       * 
       * @param {TarifarioV1Model} tarifarioSelecionado - O tarifário selecionado.
       * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa selecionada.
       * @param {Array<TipoUhV1Model>} listaUH - A lista de tipos de Unidades Hoteleiras.
       * @param {Array<{label: string, value: string}>} periodos - A lista de períodos do tarifário.
       * 
       * @returns {
       *   title: string,
       *   tarifasDefinidas: TarifasV1Model,
       *   nomeUhSelecionada: string,
       *   nomeTarifario: string,
       *   periodoSelecionado: string
       * }
       */
      const retorno = this.criandoTarifasSemUhEspecificadoService.iniciandoComponenteCadastrandoTarifas(
        this.tarifarioSelecionado!,
        this.tarifasDefinidas,
        this.listaUH,
        this.periodos
      )

      this.title = retorno.title;
      this.tarifasDefinidas = retorno.tarifasDefinidas;
      this.periodoSelecionado = retorno.periodoSelecionado;
      this.nomeUhSelecionada = retorno.nomeUhSelecionada;
      this.nomeTarifario = retorno.nomeTarifario;
    }

    this.inicializarObjTarifasDefinidas();

    this.loaderService.stopLoader();
  }

  /**
   * Atualiza a Unidade Hoteleira selecionada.
   * 
   * Atualiza a Unidade Hoteleira selecionada com base no valor recebido em 'nomeTipoUh'.
   * 
   * @param {string} nomeTipoUh - O nome da Unidade Hoteleira selecionada.
   * 
   * @returns {void}
   */
  onUHChange(nomeTipoUh: string): void {
    this.tarifasDefinidas.tipoUh = this.listaUH.find(e => e.nomeTipoUh === nomeTipoUh);
    this.periodos = [
      {
        label: 'Alta Temporada e Feriados',
        value: 'isAltaTemporadaEFeriados'
      },
      {
        label: 'Domingo à Quinta',
        value: 'isDomingoAQuinta'
      },
      {
        label: 'Quinta à Domingo',
        value: 'isQuintaADomingo'
      }
    ]

    this.inicializarObjTarifasDefinidas();
  }

  /**
   * Retorna o label do período selecionado.
   * 
   * @returns {string} - O label do período selecionado.
   */
  get labelPeriodo(): string {
    return this.periodos.find(e => e.value === this.periodoSelecionado)?.label!
  }

  /**
   * Recupera a lista de tipos de unidades Hoteleiras.
   * 
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async getTiposUH(): Promise<void> {
    this.loaderService.startLoader();

    try {
      /**
       * Realiza uma requisição GET para a API.
       * 
       * @type {Promise<ResultV1Model>} - Uma promise contendo o resultado da operação.
       */
      const resultado = await lastValueFrom(this.comunicacaoComApiTarifario.getListaUh());

      if (resultado.success) {
        /**
         * Atribui o resultado da requisição para a variável 'listaUH'.
         * 
         * @type {TipoUhV1Model[]} - A lista de tipos de unidades Hoteleiras.
         */
        this.listaUH = resultado.data;
        await this.getTarifarioById()
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        /**
         * Trata o erro HTTP e exibe uma mensagem de erro.
         * 
         * @param {HttpErrorResponse} error - O erro HTTP.
         */
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error');
        console.log(error);
      }
    }
  }

  /**
   * Recupera o tarifário pelo seu 'id' passado por parâmetro na URL.
   * 
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async getTarifarioById(naoPreencherForm = false): Promise<void> {
    this.loaderService.startLoader();

    try {
      /**
       * Realiza uma requisição GET para a API com base no 'id' passado na URL.
       * 
       * @type {Promise<ResultV1Model>} - Uma promise contendo o resultado da operação.
       */
      const resultado = await lastValueFrom(this.comunicacaoComApiTarifario.getTarifarioById(this.urlParams.id_tarifario!));
      if (resultado.success) {
        /**
         * Atribui o resultado da requisição para a variável 'tarifarioSelecionado'.
         * 
         * @type {TarifarioV1Model | undefined} - O tarifário selecionado pelo 'id'.
         */
        this.tarifarioSelecionado = resultado.data;
        this.tarifasDefinidas._idTarifario = this.tarifarioSelecionado!._id;

        if (this.tarifarioSelecionado!.excluded) {
          /**
           * Exibe uma mensagem de alerta caso o tarifário esteja excluído.
           * 
           * @param {string} title - O título da mensagem.
           * @param {string} text - O texto da mensagem.
           * @param {string} icon - O tipo de ícone da mensagem (e.g., 'success', 'error', 'warning').
           */
          Swal.fire(
            'Tarifário excluído',
            `O tarifário ${this.tarifarioSelecionado!.nomeTarifario} foi excluído! Não é possível adicionar tarifas, neste caso.`,
            'warning'
          ).then(() => {
            /**
             * Redireciona para a página de gestão de tarifários.
             * 
             * @param {string[]} commands - Os comandos de navegação.
             */
            this.router.navigate(['/reservas/gestao-tarifario']);
          })
        } else {
          if (!naoPreencherForm) {
            this.preencherForm();
          } else {
            this.inicializarObjTarifasDefinidas();
          }
        }
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        /**
         * Trata o erro HTTP e exibe uma mensagem de erro.
         * 
         * @param {HttpErrorResponse} error - O erro HTTP.
         */
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error: ', error);
      }
      /**
       * Para o carregador.
       */
      this.loaderService.stopLoader();
    }
  }

  /**
   * Inicializa o objeto 'tarifasDefinidas' com todas as propriedades necessárias,
   * definindo valores padrão ou 'undefined' onde necessário.
   * 
   * @returns {void} - Nenhum valor é retornado.
   */
  inicializarObjTarifasDefinidas() {
    const tarifaExistente = this.tarifarioSelecionado?.tarifas.find(e =>
      e.tipoUh?.nomeTipoUh === this.nomeUhSelecionada
      && this.avaliarSePeriodoJaFoiCadastrado(e)
    );

    // Inicializa os valores da Pensão Completa
    this.tarifasDefinidas.valorPensaoCompleta = {
      simples: tarifaExistente?.valorPensaoCompleta?.simples ?? undefined,    // Valor para ocupação simples
      duplo: tarifaExistente?.valorPensaoCompleta?.duplo ?? undefined,      // Valor para ocupação dupla
      triplo: tarifaExistente?.valorPensaoCompleta?.triplo ?? undefined,     // Valor para ocupação tripla
      quadruplo: tarifaExistente?.valorPensaoCompleta?.quadruplo ?? undefined,  // Valor para ocupação quadrupla
      quintuplo: tarifaExistente?.valorPensaoCompleta?.quintuplo ?? undefined,  // Valor para ocupação quíntupla
      adicional: tarifaExistente?.valorPensaoCompleta?.adicional ?? undefined,  // Valor para ocupação adicional
      crianca1: tarifaExistente?.valorPensaoCompleta?.crianca1 ?? undefined,   // Valor para primeira criança
      crianca2: tarifaExistente?.valorPensaoCompleta?.crianca2 ?? undefined    // Valor para segunda criança
    };

    // Inicializa os valores da Meia Pensão Almoço
    this.tarifasDefinidas.valorMeiaPensaoAlmoco = {
      simples: tarifaExistente?.valorMeiaPensaoAlmoco?.simples ?? undefined,    // Valor para ocupação simples
      duplo: tarifaExistente?.valorMeiaPensaoAlmoco?.duplo ?? undefined,      // Valor para ocupação dupla
      triplo: tarifaExistente?.valorMeiaPensaoAlmoco?.triplo ?? undefined,     // Valor para ocupação tripla
      quadruplo: tarifaExistente?.valorMeiaPensaoAlmoco?.quadruplo ?? undefined,  // Valor para ocupação quadrupla
      quintuplo: tarifaExistente?.valorMeiaPensaoAlmoco?.quintuplo ?? undefined,  // Valor para ocupação quíntupla
      adicional: tarifaExistente?.valorMeiaPensaoAlmoco?.adicional ?? undefined,  // Valor para ocupação adicional
      crianca1: tarifaExistente?.valorMeiaPensaoAlmoco?.crianca1 ?? undefined,   // Valor para primeira criança
      crianca2: tarifaExistente?.valorMeiaPensaoAlmoco?.crianca2 ?? undefined    // Valor para segunda criança
    };

    // Inicializa os valores da Meia Pensão Jantar
    this.tarifasDefinidas.valorMeiaPensaoJantar = {
      simples: tarifaExistente?.valorMeiaPensaoJantar?.simples ?? undefined,    // Valor para ocupação simples
      duplo: tarifaExistente?.valorMeiaPensaoJantar?.duplo ?? undefined,      // Valor para ocupação dupla
      triplo: tarifaExistente?.valorMeiaPensaoJantar?.triplo ?? undefined,     // Valor para ocupação tripla
      quadruplo: tarifaExistente?.valorMeiaPensaoJantar?.quadruplo ?? undefined,  // Valor para ocupação quadrupla
      quintuplo: tarifaExistente?.valorMeiaPensaoJantar?.quintuplo ?? undefined,  // Valor para ocupação quíntupla
      adicional: tarifaExistente?.valorMeiaPensaoJantar?.adicional ?? undefined,  // Valor para ocupação adicional
      crianca1: tarifaExistente?.valorMeiaPensaoJantar?.crianca1 ?? undefined,   // Valor para primeira criança
      crianca2: tarifaExistente?.valorMeiaPensaoJantar?.crianca2 ?? undefined    // Valor para segunda criança
    };

    // Inicializa os valores do Café da Manhã
    this.tarifasDefinidas.valorPensaoCafeManha = {
      simples: tarifaExistente?.valorPensaoCafeManha?.simples ?? undefined,    // Valor para ocupação simples
      duplo: tarifaExistente?.valorPensaoCafeManha?.duplo ?? undefined,      // Valor para ocupação dupla
      triplo: tarifaExistente?.valorPensaoCafeManha?.triplo ?? undefined,     // Valor para ocupação tripla
      quadruplo: tarifaExistente?.valorPensaoCafeManha?.quadruplo ?? undefined,  // Valor para ocupação quadrupla
      quintuplo: tarifaExistente?.valorPensaoCafeManha?.quintuplo ?? undefined,  // Valor para ocupação quíntupla
      adicional: tarifaExistente?.valorPensaoCafeManha?.adicional ?? undefined,  // Valor para ocupação adicional
      crianca1: tarifaExistente?.valorPensaoCafeManha?.crianca1 ?? undefined,   // Valor para primeira criança
      crianca2: tarifaExistente?.valorPensaoCafeManha?.crianca2 ?? undefined    // Valor para segunda criança
    };

    // Se um tarifário estiver selecionado, define o ID do tarifário
    if (this.tarifarioSelecionado && !this.tarifasDefinidas._idTarifario) {
      this.tarifasDefinidas._idTarifario = this.tarifarioSelecionado._id;
    }

    // Se um tipo de UH estiver selecionado, define o ID do tipo de UH
    if (this.nomeUhSelecionada && !this.tarifasDefinidas.tipoUh) {
      this.tarifasDefinidas.tipoUh = this.listaUH.find(
        uh => uh.nomeTipoUh === this.nomeUhSelecionada
      );
    }
  }

  /**
   * Salva as tarifas definidas e, opcionalmente, retorna à página de gestão de tarifários.
   * 
   * @param {boolean} isSalvarESair - Indica se deve salvar e sair para a página de gestão.
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async salvarTarifasDefinidas(isSalvarESair: boolean = false): Promise<void> {
    this.loaderService.startLoader(); // Inicia o carregador,
    let isEditandoUmaTarifa: boolean = false;
    try {
      // Verifica se o objeto tarifasDefinidas possui os valores obrigatórios
      if (Object.values(this.verificarSeOObjTarifasDefinidasPossuiOsValoresObrigatorios()).some(e => !e)) {
        this.loaderService.stopLoader();
        Swal.fire(
          'Atenção',
          'Preencha todos os campos obrigatórios',
          'warning'
        )
        return
      }

      if (this.tarifasDefinidas) {
        if (this.urlParams.id_tarifa) {
          await this.excluirTarifaParaAtualizacao(
            this.urlParams.id_tarifa, this.tarifasDefinidas!,
          )

          isEditandoUmaTarifa = true;
        }

        // Atualiza as tarifas definidas através da API
        const resultado = await lastValueFrom(this.tarifasComunicacaoApi.putAtualizarTarifa(
          this.tarifasDefinidas));

        // Exibe uma mensagem com base no sucesso da operação
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          resultado.success ? 'success' : 'error'
        );

        if (resultado.success) {
          // Remove o período selecionado da lista de períodos
          this.periodos.splice(
            this.periodos.indexOf(
              this.periodos.find(e => e.value === this.periodoSelecionado)!
            ),
            1
          );

          this.tarifasDefinidas = {} as TarifasV1Model;
          this.inicializarObjTarifasDefinidas(); // Reinicializa o objeto tarifasDefinidas

          this.getTarifarioById(true);

          if (isSalvarESair || isEditandoUmaTarifa) {
            this.voltarAGestaoTarifarios(); // Retorna à página de gestão de tarifários
            return
          }

          if (this.periodos.length > 0) {
            this.periodoSelecionado = this.periodos[0].value ?? ''; // Atualiza o período selecionado
            Swal.fire(
              'Período alterado para ' + this.labelPeriodo,
            )

            if (this.isCriandoTarifasSemUHPreDefinido) {
              this.alterarUhSelecionada();

              if (!this.nomeUhSelecionada) {
                Swal.fire(
                  'Tarifas Cadastradas',
                  'Todas as tarifas para este tarifário foram cadastradas. Você será redirecionado à página de gestão de tarifas.',
                  'info'
                ).then(() => {
                  this.voltarAGestaoTarifarios();
                })
              }
            }

          } else {
            Swal.fire({
              title: 'Tarifas Cadastradas',
              text: 'Todas as tarifas para esta Unidade Hoteleira foram cadastradas. Deseja retornar à página de gestão de tarifas ou continuar cadastrando tarifas para outra UH?.',
              icon: 'question',
              allowEnterKey: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: 'Retornar à gestão',
              showDenyButton: true,
              denyButtonText: 'Continuar cadastrando'
            }).then(result => {
              if (result.isDenied) {
                this.alterarUhSelecionada();
                this.periodos = [
                  {
                    label: 'Alta Temporada e Feriados',
                    value: 'isAltaTemporadaEFeriados'
                  },
                  {
                    label: 'Domingo à Quinta',
                    value: 'isDomingoAQuinta'
                  },
                  {
                    label: 'Quinta à Domingo',
                    value: 'isQuintaADomingo'
                  }
                ]
              } else if (result.isConfirmed) {
                this.voltarAGestaoTarifarios();
              }
            })
          }
        }
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Trata erros HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error'); // Log de erro genérico
        console.log(error);
      }
    } finally {
      this.loaderService.stopLoader(); // Para o carregador
    }
  }

  /**
   * Altera a Unidade Hoteleira selecionada.
   * 
   * Remove a Unidade Hoteleira selecionada da lista de Unidades Hoteleiras e 
   * define a próxima Unidade Hoteleira como selecionada.
   * Se a lista estiver vazia, define o valor de nomeUhSelecionada como vazio.
   */
  alterarUhSelecionada() {
    // Remove a Unidade Hoteleira selecionada da lista de Unidades Hoteleiras
    this.listaUH.splice(
      this.listaUH.indexOf(this.listaUH.find(uh => uh.nomeTipoUh === this.nomeUhSelecionada)!),
      1
    );

    // Define a próxima Unidade Hoteleira como selecionada
    this.nomeUhSelecionada = this.listaUH.find(uh => uh.nomeTipoUh !== this.nomeUhSelecionada)?.nomeTipoUh ?? '';
  }

  /**
   * Volta para a tabela de tarifas
   */
  voltarAGestaoTarifarios() {
    this.router.navigate([
      '/reservas/gestao-tarifario/tarifas/',
      this.tarifarioSelecionado!._id,
    ])
  }

  /**
   * Verifica se o objeto `tarifasDefinidas` tem todos os valores obrigatórios.
   * 
   * @returns {Object} - Um objeto com quatro propriedades booleanas:
   *   isPeriodoDefinido: boolean - Indica se o período (Alta Temporada e Feriados, Domingo a Quinta ou Quinta a Domingo) foi definido.
   *   isTarifaDefinida: boolean - Indica se a tarifa foi definida.
   *   isUhDefinido: boolean - Indica se a Unidade Hoteleira foi definida.
   *   isIdTarifario: boolean - Indica se o ID do tarifário foi definido.
   */
  verificarSeOObjTarifasDefinidasPossuiOsValoresObrigatorios() {
    let isPeriodoDefinido = this.tarifasDefinidas.isAltaTemporadaEFeriados || this.tarifasDefinidas.isDomingoAQuinta || this.tarifasDefinidas.isQuintaADomingo
    const isTarifaDefinida = this.verificarSeValoresDeTarifasEstaoPreenchidos(this.tarifasDefinidas)
    const isUhDefinido = this.tarifasDefinidas.tipoUh ? true : false
    const isIdTarifario = this.tarifasDefinidas._idTarifario ? true : false

    if (!isPeriodoDefinido) {
      this.definirPeriodoSelecionado()
      isPeriodoDefinido = this.tarifasDefinidas.isAltaTemporadaEFeriados || this.tarifasDefinidas.isDomingoAQuinta || this.tarifasDefinidas.isQuintaADomingo
    }

    return {
      isPeriodoDefinido,
      isTarifaDefinida,
      isUhDefinido,
      isIdTarifario
    }
  }

  /**
   * Define o período da tarifa com base no período selecionado.
   * 
   * Verifica qual período foi selecionado e define a propriedade correspondente.
   * 
   * @returns {void} - Sem valor de retorno.
   */
  definirPeriodoSelecionado() {
    if (this.periodoSelecionado === 'isAltaTemporadaEFeriados') {
      this.tarifasDefinidas.isAltaTemporadaEFeriados = true
      // Verifica qual período foi selecionado e define a propriedade correspondente
    } else if (this.periodoSelecionado === 'isDomingoAQuinta') {
      this.tarifasDefinidas.isDomingoAQuinta = true
    } else if (this.periodoSelecionado === 'isQuintaADomingo') {
      this.tarifasDefinidas.isQuintaADomingo = true
    }
  }

  /**
   * Define o período da tarifa com base no período selecionado.
   * @param {TarifasV1Model} tarifa - A tarifa a ser verificada.
   * @returns {boolean} - True se o período da tarifa for o mesmo que o período selecionado, false caso contrário.
   */
  avaliarSePeriodoJaFoiCadastrado(tarifa: TarifasV1Model): boolean {
    // Verifica se o período da tarifa é o mesmo que o período selecionado
    if (tarifa.isAltaTemporadaEFeriados && this.periodoSelecionado === 'isAltaTemporadaEFeriados') {
      // Marca o período como Alta Temporada e Feriados
      return true;
    } else if (tarifa.isDomingoAQuinta && this.periodoSelecionado === 'isDomingoAQuinta') {
      // Marca o período como Domingo a Quinta
      return true;
    } else if (tarifa.isQuintaADomingo && this.periodoSelecionado === 'isQuintaADomingo') {
      // Marca o período como Quinta a Domingo
      return true;
    } else {
      // Se o período da tarifa for diferente do período selecionado, retorna false
      return false;
    }
  }

  /**
   * Desabilita o botão de cadastrar tarifas se nenhum valor foi preenchido.
   * 
   * A função verifica se algum valor em 'valorPensaoCafeManha' ou 'valorMeiaPensaoAlmoco' está preenchido.
   * Retorna true se nenhum dos valores estiver preenchido, caso contrário, retorna false.
   * 
   * @returns {boolean} - True se nenhum dos valores estiver preenchido, false caso contrário.
   */
  desabilitarBotao(): boolean {
    return !this.verificarSeValoresDeTarifasEstaoPreenchidos(this.tarifasDefinidas);
  }

  /**
   * Verifica se alguns dos valores de uma tarifa estão preenchidos.
   * 
   * A função verifica os valores de uma tarifa que estão preenchidos.
   * Retorna true se pelo menos um dos valores de tarifa estiver preenchido, caso contrário, retorna false.
   * 
   * @returns {boolean} - True se pelo menos um dos valores de tarifa estiver preenchido, false caso contrário.
   */
  verificarSeValoresDeTarifasEstaoPreenchidos(tarifa: TarifasV1Model): boolean {
    let cafeManhaPreenchido;
    let meiaPensaoAlmocoPreenchido;
    let meiaPensaoJantarPreenchido;
    let pensaoCompletaPreenchido;

    try {
      // Verifica se algum valor em 'valorPensaoCafeManha' está definido
      cafeManhaPreenchido = Object.values(tarifa.valorPensaoCafeManha!).some(e => e !== undefined);
    } catch (error) {
      cafeManhaPreenchido = false;
    }

    try {
      // Verifica se algum valor em 'valorMeiaPensaoAlmoco' está definido
      meiaPensaoAlmocoPreenchido = Object.values(tarifa.valorMeiaPensaoAlmoco!).some(e => e !== undefined);
    } catch (error) {
      meiaPensaoAlmocoPreenchido = false;
    }

    try {
      // Verifica se algum valor em 'valorMeiaPensaoJantar' está definido
      meiaPensaoJantarPreenchido = Object.values(tarifa.valorMeiaPensaoJantar!).some(e => e !== undefined);
    } catch (error) {
      meiaPensaoJantarPreenchido = false;
    }

    try {
      // Verifica se algum valor em 'valorPensaoCompleta' está definido
      pensaoCompletaPreenchido = Object.values(tarifa.valorPensaoCompleta!).some(e => e !== undefined);
    } catch (error) {
      pensaoCompletaPreenchido = false;
    }

    // Retorna true se pelo menos um dos campos tiver valores preenchidos
    return cafeManhaPreenchido || meiaPensaoAlmocoPreenchido || meiaPensaoJantarPreenchido || pensaoCompletaPreenchido;
  }

  /**
   * Exclui uma tarifa de um tarifário.
   * Realiza uma requisição PUT para a API com o ID do tarifário e o ID da tarifa a ser excluída.
   * Se a requisição for bem sucedida, não faz nada.
   * Se a requisição falhar, exibe uma mensagem de erro na console.
   *  
   * Atualmente, o comportamento do editar uma tarifa existente está criando uma nova 
   * tarifa, contendo o mesmo período. Por conta disto, esta função é utilizada para
   * quando o usuário confirmar a alteração na tarifa, antes de ser feito o put para a api,
   * é realizado o delete da tarifa antiga.
   * 
   * @param {string} id_tarifa - O ID da tarifa a ser excluída.
   * @param {Object} tarifasDefinidas - O objeto com o ID do tarifário.
   * @param {string} tarifasDefinidas._idTarifario - O ID do tarifário.
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async excluirTarifaParaAtualizacao(id_tarifa: string, { _idTarifario }: { _idTarifario?: string }): Promise<void> {
    try {
      await lastValueFrom(this.tarifasComunicacaoApi.putExcluirTarifa({
        _idTarifario: _idTarifario!,
        _idTarifas: id_tarifa
      }));
    } catch (error) {
      console.error('Erro ao excluir tarifa:', error);
    }
  }
}

