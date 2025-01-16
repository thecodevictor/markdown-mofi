import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TarifarioAgrupadoV1Interface } from 'src/app/routes/home/dashboard/models/tarifario-agrupado-v1.interface';
import { ComunicacaoApiTarifarioV1Service } from 'src/app/routes/home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import Swal from 'sweetalert2';
import { TarifarioV1Model } from '../../models/tarifario-v1.model';
import { TarifasV1Model } from '../../models/tarifas-v1.model';
import { TipoUhV1Model } from '../../models/tipo-uh-v1.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TarifasComunicacaoApiV1Service } from '../../services/tarifas-comunicacao-api-v1.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-tabela-tarifas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    RouterLink
  ],
  templateUrl: './tabela-tarifas.component.html',
  styles: ``
})
export class TabelaTarifasComponent implements OnInit {
  // variáveis de ambiente
  idTarifarioUrl = this.activatedRoute.snapshot.params['id_tarifario'];
  tarifarioSelecionado?: TarifarioV1Model;
  tarifarioAgrupadoPorUH: TarifarioAgrupadoV1Interface[] = [];
  id_tipo_uh: string = '';
  listaUH: TipoUhV1Model[] = [];
  isTarifa = {
    isDomingoAQuinta: true,
    isQuintaADomingo: true,
    isAltaTemporadaEFeriados: true
  }

  constructor(
    private comunicacaoComApiTarifario: ComunicacaoApiTarifarioV1Service,
    private comunicacaoComApiTarifas: TarifasComunicacaoApiV1Service,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    private formatarParaReal: FormatarValoresService,
    private mensagemToastrService: MensagemToastrService
  ) { }

  ngOnInit(): void {
    this.getTarifarioById();
  }

  /**
   * Recupera o tarifário pelo seu 'id' passado por parâmetro na URL.
   * 
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async getTarifarioById(): Promise<void> {
    this.loaderService.startLoader();

    try {
      /**
       * Realiza uma requisição GET para a API com base no 'id' passado na URL.
       * 
       * @type {Promise<ResultV1Model>} - Uma promise contendo o resultado da operação.
       */
      const resultado = await lastValueFrom(this.comunicacaoComApiTarifario.getTarifarioById(this.idTarifarioUrl));
      if (resultado.success) {
        /**
         * Atribui o resultado da requisição para a variável 'tarifarioSelecionado'.
         * 
         * @type {TarifarioV1Model | undefined} - O tarifário selecionado pelo 'id'.
         */
        this.tarifarioSelecionado = resultado.data;

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
          if (this.tarifarioSelecionado?.tarifas?.length! > 0) {
            this.tarifarioAgrupadoPorUH = this.agruparTarifasPorTipoUh().filter(
              e => e.tipoUh!
            );

            console.log('this.tarifarioAgrupadoPorUH')
            console.log(this.tarifarioAgrupadoPorUH)
          } else {
            this.tarifarioAgrupadoPorUH = [];
          }
          this.getListaUH();

          this.listaUH = this.tarifarioAgrupadoPorUH.map(el => { return el.tipoUh });
          this.id_tipo_uh = this.tarifarioAgrupadoPorUH[0].tipoUh?._id!;
          this.verificarSeTodosOsPeriodosJaPossuemTarifas()
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
    } finally {
      /**
       * Para o carregador.
       */
      this.loaderService.stopLoader();
    }
  }


  /**
   * Recupera a lista de tipos de unidades Hoteleiras.
   * 
   * @returns {Promise<void>} - Uma promise que resolve sem valor.
   */
  async getListaUH(): Promise<void> {
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
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Determina a descrição do período para uma dada 'tarifa' com base em suas propriedades.
   * 
   * @param {TarifasV1Model} tarifa - O objeto tarifa contendo informações sobre o período.
   * @returns {string} - Uma string descrevendo o período da tarifa.
   */
  definirPeriodo(tarifa: TarifasV1Model): string {
    // Verifica se o período é de quinta-feira à domingo
    if (tarifa.isQuintaADomingo) {
      return 'De quinta-feira a domingo';
      // Verifica se o período é de domingo à quinta-feira
    } else if (tarifa.isDomingoAQuinta) {
      return 'De domingo a quinta-feira';
      // Verifica se o período inclui alta temporada e feriados
    } else if (tarifa.isAltaTemporadaEFeriados) {
      return 'Alta temporada e feriados';
      // Retorna uma string vazia se nenhuma opção for verdadeira
    } else {
      return '';
    }
  }

  /**
   * Define o valor por pessoa para uma dada 'tarifa' e 'tipo'.
   * 
   * @param {TarifasV1Model} tarifa - O objeto tarifa contendo valores de pensão.
   * @param {string} tipo - O tipo de acomodação (e.g., 'single', 'duplo').
   * @returns {Object} Um objeto contendo valores de café da manhã e meia pensão formatados.
   */
  definirValorPorPessoa(tarifa: TarifasV1Model, tipo: 'single' | 'duplo' | 'triplo' | 'quad' | 'quint' | 'adc'): {
    cafeManha: string;
    meiaPensao: string;
  } {
    // Inicializa o objeto para armazenar os valores formatados
    let data = {} as { cafeManha: string; meiaPensao: string };

    // Determine os valores com base no tipo de acomodação
    switch (tipo) {
      case 'single':
        // Formata os valores para uma acomodação simples
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.simples),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.simples)
        };
        break;
      case 'duplo':
        // Formata os valores para uma acomodação dupla
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.duplo),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.duplo)
        };
        break;
      case 'triplo':
        // Formata os valores para uma acomodação tripla
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.triplo),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.triplo)
        };
        break;
      case 'quad':
        // Formata os valores para uma acomodação quadrupla
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.quadruplo),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.quadruplo)
        };
        break;
      case 'quint':
        // Formata os valores para uma acomodação quintupla
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.quintuplo),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.quintuplo)
        };
        break;
      case 'adc':
        // Formata os valores para uma acomodação adicional
        data = {
          cafeManha: this.formatarParaReal.formatar(tarifa.valorPensaoCafeManha?.adicional),
          meiaPensao: this.formatarParaReal.formatar(tarifa.valorMeiaPensaoAlmoco?.adicional)
        };
        break;
      default:
        // Retorna dados vazios se o tipo não for reconhecido
        break;
    }

    return data;
  }

  /**
   * Agrupa as tarifas do tarifário selecionado por tipo de unidade hoteleira.
   *
   * @returns {TarifarioAgrupadoV1Interface[]} - Array de objetos com as tarifas agrupadas por tipo de unidade hoteleira.
   */
  agruparTarifasPorTipoUh(): TarifarioAgrupadoV1Interface[] {
    const tarifasAgrupadas = this.tarifarioSelecionado!.tarifas.reduce(
      (acc: any, tarifa: TarifasV1Model) => {
        const uhId = tarifa.tipoUh?._id!;
        // Verifica se a unidade hoteleira já existe no objeto de agrupamento
        if (!acc[uhId]) {
          // Se não existir, cria um novo objeto com a unidade hoteleira e um array de tarifas
          acc[uhId] = {
            tipoUh: tarifa.tipoUh,
            tarifas: []
          };
        }
        // Adiciona a tarifa ao array de tarifas da unidade hoteleira
        acc[uhId].tarifas.push({
          valorPensaoCafeManha: tarifa.valorPensaoCafeManha,
          valorMeiaPensaoAlmoco: tarifa.valorMeiaPensaoAlmoco,
          isPadrao: tarifa.isPadrao,
          isDomingoAQuinta: tarifa.isDomingoAQuinta,
          isQuintaADomingo: tarifa.isQuintaADomingo,
          isAltaTemporadaEFeriados: tarifa.isAltaTemporadaEFeriados,
          _id: tarifa._id
        });

        // Retorna o objeto de agrupamento
        return acc;
      }, {});

    // Converte o objeto de agrupamento em um array de objetos
    const tarifasAgrupadasArray: TarifarioAgrupadoV1Interface[] = Object.values(tarifasAgrupadas);

    // Para o Loader
    this.loaderService.stopLoader();

    return tarifasAgrupadasArray;
  }

  /**
   * Abre o formulário de cadastro de tarifa.
   * Se um parâmetro tarifa for passado, o formulário será aberto em modo de edição.
   * Se o parâmetro tarifa não for passado, o formulário será aberto em modo de criação.
   *
   * @param tarifa - Tarifa a ser editada (opcional)
   */
  navegarAteFormTarifa(tarifa?: TarifasV1Model) {
    if (tarifa) {
      // Abre o formulário em modo de edição
      this.router.navigate([
        '/reservas/gestao-tarifario/tarifas/',
        this.tarifarioSelecionado!._id,
        'cadastrar',
        {
          id_tarifa: tarifa._id,
          id_tipo_uh: this.id_tipo_uh
        }
      ])
    } else {
      let periodosString = '';

      if (!this.isTarifa.isDomingoAQuinta) {
        periodosString += 'isDomingoAQuinta,';
      }

      if (!this.isTarifa.isQuintaADomingo) {
        periodosString += 'isQuintaADomingo,';
      }

      if (!this.isTarifa.isAltaTemporadaEFeriados) {
        periodosString += 'isAltaTemporadaEFeriados,';
      }

      // Abre o formulário em modo de criação
      this.router.navigate([
        `/reservas/gestao-tarifario/tarifas`,
        this.idTarifarioUrl,
        'cadastrar',
        this.id_tipo_uh! ?
          { periodo_tarifa: periodosString, id_tipo_uh: this.id_tipo_uh }
          : { periodo_tarifa: periodosString }
      ]);
    }
  }

  /**
   * Exclui uma tarifa do tarifário selecionado.
   * Realiza uma requisição PUT para a API com o ID do tarifário e o ID da tarifa a ser excluída.
   * Se a requisição for bem sucedida, exibe uma mensagem de sucesso e recupera as tarifas do tarifário.
   * Se a requisição falhar, exibe uma mensagem de erro e recupera as tarifas do tarifário.
   * @param tarifa - A tarifa a ser excluída.
   */
  async excluirTarifa(tarifa: TarifasV1Model) {
    this.loaderService.startLoader();
    try {
      const resultado = await lastValueFrom(this.comunicacaoComApiTarifas.putExcluirTarifa({
        _idTarifario: this.tarifarioSelecionado?._id!,
        _idTarifas: tarifa._id!
      }))

      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : 'error'
      )

      this.getTarifarioById();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)

        console.log('typeof error')
        console.log(typeof error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Mostra uma mensagem de confirmação antes de excluir uma tarifa.
   * Se confirmado, exclui a tarifa.
   * Se cancelado, exibe uma mensagem de aviso informando que a exclusão foi cancelada.
   * @param tarifa - A tarifa a ser excluída.
   */
  alertaExcluirTarifa(tarifa: TarifasV1Model) {
    Swal.fire({
      // Título da mensagem de confirmação
      title: 'Excluir tarifa',
      // Texto da mensagem de confirmação
      text: 'Tem certeza que deseja excluir essa tarifa?',
      // Ícone da mensagem de confirmação
      icon: 'question',
      // Mostra o botão de confirmação
      showConfirmButton: true,
      // Texto do botão de confirmação
      confirmButtonText: 'Sim',
      // Mostra o botão de cancelamento
      showCancelButton: true,
      // Texto do botão de cancelamento
      cancelButtonText: 'Não',
    }).then((result) => {
      // Se o usuário confirmou a exclusão
      if (result.isConfirmed) {
        // Exclui a tarifa
        this.excluirTarifa(tarifa);
      } else {
        // Exibe uma mensagem de aviso informando que a exclusão foi cancelada
        this.mensagemToastrService.show(
          'Nenhuma tarifa foi excluída.',
          'Exclusão cancelada.',
          'info'
        );
      }
    });
  }

  /**
   * Verifica se todos os períodos (Domingo à Quinta, Quinta à Domingo e Alta Temporada e Feriados)
   * ja possuem tarifas.
   * Se todos os períodos possuem tarifas, retorna true.
   * Se não, retorna false e popula o objeto `isTarifa` com as informações de quais períodos
   * ainda não possuem tarifas.
   * @returns {boolean} - True se todos os períodos possuem tarifas, false caso contrário.
   */
  verificarSeTodosOsPeriodosJaPossuemTarifas(): boolean {
    const periodos: {
      isDomingoAQuinta: boolean;
      isQuintaADomingo: boolean;
      isAltaTemporadaEFeriados: boolean;
    }[] = this.tarifasUhSelecionado.map(e => {
      return {
        isDomingoAQuinta: e.isDomingoAQuinta ?? false,
        isQuintaADomingo: e.isQuintaADomingo ?? false,
        isAltaTemporadaEFeriados: e.isAltaTemporadaEFeriados ?? false
      }
    });

    this.isTarifa = {
      isDomingoAQuinta: periodos.find(e => e.isDomingoAQuinta) ? true : false,
      isQuintaADomingo: periodos.find(e => e.isQuintaADomingo) ? true : false,
      isAltaTemporadaEFeriados: periodos.find(e => e.isAltaTemporadaEFeriados) ? true : false,
    };

    if (periodos.length === 3) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retorna as tarifas do tipo de unidade hoteleira selecionada.
   * 
   * @returns {TarifasV1Model[]} - Array de objetos com as tarifas do tipo de unidade hoteleira selecionada.
   */
  get tarifasUhSelecionado(): TarifasV1Model[] {
    // Procura o tipo de unidade hoteleira selecionada no array de tarifas agrupadas por tipo de unidade hoteleira
    const tarifasAgrupadas = this.tarifarioAgrupadoPorUH.find(
      tarifario => tarifario.tipoUh._id === this.id_tipo_uh
    );

    // Retorna o array de tarifas do tipo de unidade hoteleira selecionada, ou um array vazio se nenhuma for encontrada
    return tarifasAgrupadas ? tarifasAgrupadas.tarifas : [];
  }

  /**
   * Retorna o tipo de unidade hoteleira selecionada.
   * 
   * @returns {TipoUhV1Model | undefined} - O tipo de unidade hoteleira selecionada, ou undefined se nenhuma for encontrada.
   */
  get tipoUh() {
    // Procura o tipo de unidade hoteleira selecionada no array de tarifas agrupadas por tipo de unidade hoteleira
    const tarifasAgrupadas = this.tarifarioAgrupadoPorUH.find(
      tarifario => tarifario.tipoUh._id === this.id_tipo_uh
    );

    // Retorna o tipo de unidade hoteleira selecionada, ou undefined se nenhuma for encontrada
    return tarifasAgrupadas ? tarifasAgrupadas.tipoUh : undefined;
  }
}
