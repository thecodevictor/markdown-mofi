import { Injectable } from "@angular/core";
import { TarifarioV1Model } from "../../../models/tarifario-v1.model";
import { TarifasV1Model } from "../../../models/tarifas-v1.model";

@Injectable()
export class EditarTarifasV1Service {
  constructor() { }

  /**
   * Inicializa o componente em modo de edição, preenchendo o formulário 
   * com os detalhes da tarifa selecionada.
   * 
   * Recupera a tarifa selecionada usando o ID da tarifa passado como parâmetro na URL 
   * e atualiza os campos do formulário com os valores da tarifa.
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
  iniciandoComponenteEditandoUmaTarifaEspecifica(
    tarifarioSelecionado: TarifarioV1Model,
    id_tarifa: string,
    tarifasDefinidas: TarifasV1Model,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    // Encontra a tarifa selecionada usando o ID da tarifa passado como parâmetro na URL
    const tarifaSelecionada = tarifarioSelecionado?.tarifas.find(tarifa =>
      tarifa._id === id_tarifa
    )!;

    // Define as propriedades 'tarifasDefinidas' com os valores da tarifa selecionada
    tarifasDefinidas._id = tarifaSelecionada._id;
    tarifasDefinidas.isAltaTemporadaEFeriados = tarifaSelecionada.isAltaTemporadaEFeriados;
    tarifasDefinidas.isDomingoAQuinta = tarifaSelecionada.isDomingoAQuinta;
    tarifasDefinidas.isQuintaADomingo = tarifaSelecionada.isQuintaADomingo;

    // Atribui os valores das tarifas se eles existirem
    if (tarifaSelecionada.valorPensaoCafeManha?.simples) {
      tarifasDefinidas.valorPensaoCafeManha = tarifaSelecionada.valorPensaoCafeManha;
    }
    if (tarifaSelecionada.valorMeiaPensaoAlmoco?.simples) {
      tarifasDefinidas.valorMeiaPensaoAlmoco = tarifaSelecionada.valorMeiaPensaoAlmoco;
    }
    if (tarifaSelecionada.valorMeiaPensaoJantar?.simples) {
      tarifasDefinidas.valorMeiaPensaoJantar = tarifaSelecionada.valorMeiaPensaoJantar;
    }
    if (tarifaSelecionada.valorPensaoCompleta?.simples) {
      tarifasDefinidas.valorPensaoCompleta = tarifaSelecionada.valorPensaoCompleta;
    }

    // Atribui o tipo de unidade hoteleira
    tarifasDefinidas.tipoUh = tarifaSelecionada.tipoUh;

    // Recupera o nome da unidade hoteleira a partir da tarifa selecionada
    const nomeUhSelecionada = tarifaSelecionada.tipoUh?.nomeTipoUh!;

    // Recupera o nome do tarifário
    const nomeTarifario = tarifarioSelecionado?.nomeTarifario!;

    // Define o período com base na tarifa selecionada
    const retorno = this.definindoPeriodoParametroIdTarifa(
      tarifaSelecionada,
      periodos
    );

    const periodoSelecionado = retorno.periodoSelecionado;
    periodos = retorno.periodos;

    return {
      tarifasDefinidas,
      nomeUhSelecionada,
      nomeTarifario,
      periodoSelecionado,
      periodos
    }
  }

  /**
   * Define o período da tarifa com base na tarifa selecionada.
   * 
   * Verifica qual período foi selecionado na tarifa e define a propriedade correspondente.
   * 
   * @param {TarifasV1Model} tarifaSelecionada - A tarifa selecionada.
   */
  private definindoPeriodoParametroIdTarifa(
    tarifaSelecionada: TarifasV1Model,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    let periodoSelecionado: string = '';
    // Verifica qual período foi selecionado na tarifa
    if (tarifaSelecionada.isAltaTemporadaEFeriados) {
      // Marca o período como Alta Temporada e Feriados
      periodoSelecionado = 'isAltaTemporadaEFeriados';
    } else if (tarifaSelecionada.isDomingoAQuinta) {
      // Marca o período como Domingo a Quinta
      periodoSelecionado = 'isDomingoAQuinta';
    } else if (tarifaSelecionada.isQuintaADomingo) {
      // Marca o período como Quinta a Domingo
      periodoSelecionado = 'isQuintaADomingo';
    }

    // Encontra o index do período selecionado na lista de períodos
    const indexPeriodo = periodos.indexOf(periodos.find(e => e.value === periodoSelecionado)!)

    // Define a lista de períodos com o período selecionado
    if (indexPeriodo !== -1) periodos = [periodos[indexPeriodo]];

    return {
      periodoSelecionado,
      periodos
    }
  }
}