import { Injectable } from "@angular/core";
import { TarifasV1Model } from "../../../models/tarifas-v1.model";
import { TipoUhV1Model } from "../../../models/tipo-uh-v1.model";
import { TarifarioV1Model } from "../../../models/tarifario-v1.model";

@Injectable()
export class AdicionandoTarifasDePeriodoEUhEspecificosV1Service {
  /**
   * Inicializa o componente de adicionar tarifa de período e unidade hoteleira específicos.
   * 
   * Filtra os períodos com base no valor recebido na variável 'objPeriodosSelecionadoUrl'
   * e atualiza as ligações de modelo.
   * 
   * @param {TarifarioV1Model} tarifarioSelecionado - O objeto do tarifário selecionado.
   * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa.
   * @param {string} periodo_tarifa - O valor do parâmetro 'periodo_tarifa' recebido na URL.
   * @param {string} id_tipo_uh - O valor do parâmetro 'id_tipo_uh' recebido na URL.
   * @param {Array<TipoUhV1Model>} listaUH - A lista de tipos de unidade hoteleira.
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
  public iniciandoComponenteAdicionandoTarifaDePeriodoEUhEspecifico(
    tarifarioSelecionado: TarifarioV1Model,
    tarifasDefinidas: TarifasV1Model,
    periodo_tarifa: string,
    id_tipo_uh: string,
    listaUH: Array<TipoUhV1Model>,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    let retorno;

    // Filtra períodos com base no valor recebido em 'objPeriodosSelecionadoUrl'
    retorno = this.definindoPeriodosParametroPeriodos(
      periodo_tarifa,
      tarifasDefinidas,
      periodos
    );

    periodos = retorno.periodos;
    tarifasDefinidas = retorno.tarifasDefinidas;

    // Atualiza as variáveis
    retorno = this.atualizarVariaveis(
      listaUH,
      id_tipo_uh,
      tarifasDefinidas,
      tarifarioSelecionado,
      periodos
    );

    const nomeUhSelecionada = retorno.nomeUhSelecionada;
    const nomeTarifario = retorno.nomeTarifario;
    const periodoSelecionado = retorno.periodoSelecionado;


    // Atualiza o período da tarifa definida com o período selecionado
    retorno = this.atualizarPeriodoDaTarifaDefinida(
      periodoSelecionado,
      retorno.tarifasDefinidas
    );

    tarifasDefinidas = retorno;

    return {
      tarifasDefinidas,
      nomeUhSelecionada,
      nomeTarifario,
      periodoSelecionado,
      periodos
    }
  }

  /**
   * Filtra os períodos com base no período da tarifa fornecido.
   *
   * Este método verifica quais períodos estão presentes no parâmetro 'periodo_tarifa'
   * e remove os períodos não selecionados da lista de períodos.
   *
   * @param {string} periodo_tarifa - O período da tarifa fornecido.
   * @param {Array<{label: string, value: string}>} periodos - A lista de períodos a serem filtrados.
   * @returns {Object} - Um objeto contendo a lista de períodos filtrados.
   */
  private definindoPeriodosParametroPeriodos(
    periodo_tarifa: string,
    tarifasDefinidas: TarifasV1Model,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    // Determina quais períodos estão presentes no 'periodo_tarifa'
    const isDom = periodo_tarifa.includes('isDomingoAQuinta');
    const isQuin = periodo_tarifa.includes('isQuintaADomingo');
    const isAlt = periodo_tarifa.includes('isAltaTemporadaEFeriados');

    // Remove o período 'Quinta a Domingo' se não estiver presente
    if (!isQuin) {
      const index = periodos.findIndex(e => e.value === 'isQuintaADomingo');
      if (index !== -1) periodos.splice(index, 1);
    } else {
      tarifasDefinidas.isQuintaADomingo = true;
      tarifasDefinidas.isDomingoAQuinta = false;
      tarifasDefinidas.isAltaTemporadaEFeriados = false;
    }

    // Remove o período 'Domingo a Quinta' se não estiver presente
    if (!isDom) {
      const index = periodos.findIndex(e => e.value === 'isDomingoAQuinta');
      if (index !== -1) periodos.splice(index, 1);
    } else {
      tarifasDefinidas.isDomingoAQuinta = true;
      tarifasDefinidas.isQuintaADomingo = false;
      tarifasDefinidas.isAltaTemporadaEFeriados = false;
    }

    // Remove o período 'Alta Temporada e Feriados' se não estiver presente
    if (!isAlt) {
      const index = periodos.findIndex(e => e.value === 'isAltaTemporadaEFeriados');
      if (index !== -1) periodos.splice(index, 1);
    } else {
      tarifasDefinidas.isAltaTemporadaEFeriados = true;
      tarifasDefinidas.isQuintaADomingo = false;
      tarifasDefinidas.isDomingoAQuinta = false;
    }

    return {
      periodos,
      tarifasDefinidas
    };
  }


  /**
   * Atualiza o período da tarifa definida com o período selecionado.
   * 
   * Esta fun o realiza as seguintes a es:
   * 1. Verifica qual período foi selecionado e define a propriedade correspondente.
   * 
   * @param {string} periodo - O período da tarifa a ser atualizado.
   * @param {TarifasV1Model} tarifasDefinidas - O objeto da tarifa a ser atualizado.
   * 
   * @returns {TarifasV1Model} - O objeto da tarifa atualizado.
   */
  private atualizarPeriodoDaTarifaDefinida(
    periodo: string,
    tarifasDefinidas: TarifasV1Model
  ) {
    // Verifica qual período foi selecionado e define a propriedade correspondente
    switch (periodo) {
      case 'isAltaTemporadaEFeriados':
        // Marca o período como Alta Temporada e Feriados
        tarifasDefinidas.isAltaTemporadaEFeriados = true;
        break;
      case 'isDomingoAQuinta':
        // Marca o período como Domingo a Quinta
        tarifasDefinidas.isDomingoAQuinta = true;
        break;
      case 'isQuintaADomingo':
        // Marca o período como Quinta a Domingo
        tarifasDefinidas.isQuintaADomingo = true;
        break;
    }

    return tarifasDefinidas;
  }

  /**
   * Atualiza as variáveis necessárias.
   * 
   * Esta função realiza as seguintes ações:
   * 1. Encontra o tipo de unidade hoteleira com base no valor 'id_tipo_uh' recebido na URL.
   * 2. Atribui o tipo de unidade hoteleira ao objeto 'tarifasDefinidas'.
   * 3. Atribui o nome da unidade hoteleira selecionada ao objeto 'nomeUhSelecionada'.
   * 4. Atribui o nome do tarifário selecionado ao objeto 'nomeTarifario'.
   * 5. Atribui o primeiro período do array 'periodos' ao objeto 'periodoSelecionado'.
   * 
   * @param {Array<TipoUhV1Model>} listaUH - A lista de tipos de unidade hoteleira.
   * @param {string} id_tipo_uh - O valor do parâmetro 'id_tipo_uh' recebido na URL.
   * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa.
   * @param {TarifarioV1Model} tarifarioSelecionado - O objeto do tarifário selecionado.
   * @param {Array<{label: string, value: string}>} periodos - A lista de períodos do tarifário.
   * 
   * @returns {
   *   tarifasDefinidas: TarifasV1Model,
   *   nomeTarifario: string,
   *   nomeUhSelecionada: string,
   *   periodoSelecionado: string
   * }
   */
  private atualizarVariaveis(
    listaUH: Array<TipoUhV1Model>,
    id_tipo_uh: string,
    tarifasDefinidas: TarifasV1Model,
    tarifarioSelecionado: TarifarioV1Model,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    // Encontra o tipo de unidade hoteleira com base no valor 'id_tipo_uh' recebido na URL
    const objTipoUh = listaUH.find(e => e._id === id_tipo_uh)!;

    // Atribui o nome da unidade hoteleira selecionada ao objeto 'nomeUhSelecionada'.
    const nomeUhSelecionada = objTipoUh?.nomeTipoUh!;

    // Atribui o nome do tarifário selecionado ao objeto 'nomeTarifario'.
    const nomeTarifario = tarifarioSelecionado?.nomeTarifario!

    // Atribui o primeiro período do array 'periodos' ao objeto 'periodoSelecionado'.
    const periodoSelecionado = periodos[0].value

    const tarifaExistente = tarifarioSelecionado?.tarifas.find(e =>
      e.tipoUh?.nomeTipoUh === nomeUhSelecionada
      && this.avaliarSePeriodoJaFoiCadastrado(e, periodoSelecionado)
    );

    // Atribui o tipo de unidade hoteleira ao objeto 'tarifasDefinidas'.
    if (tarifaExistente) {
      tarifasDefinidas = tarifaExistente;
    } else {
      tarifasDefinidas.tipoUh = objTipoUh;
    }

    return {
      tarifasDefinidas,
      nomeTarifario,
      nomeUhSelecionada,
      periodoSelecionado
    }
  }

  private avaliarSePeriodoJaFoiCadastrado(tarifa: TarifasV1Model, periodoSelecionado: string): boolean {
    if (tarifa.isAltaTemporadaEFeriados && periodoSelecionado === 'isAltaTemporadaEFeriados') {
      // Marca o período como Alta Temporada e Feriados
      return true;
    } else if (tarifa.isDomingoAQuinta && periodoSelecionado === 'isDomingoAQuinta') {
      // Marca o período como Domingo a Quinta
      return true;
    } else if (tarifa.isQuintaADomingo && periodoSelecionado === 'isQuintaADomingo') {
      // Marca o período como Quinta a Domingo
      return true;
    } else {
      return false;
    }
  }
}