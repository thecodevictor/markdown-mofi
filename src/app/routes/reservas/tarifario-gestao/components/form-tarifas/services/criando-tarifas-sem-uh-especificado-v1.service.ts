import { Injectable } from "@angular/core";
import { TarifarioV1Model } from "../../../models/tarifario-v1.model";
import { TarifasV1Model } from "../../../models/tarifas-v1.model";
import { TipoUhV1Model } from "../../../models/tipo-uh-v1.model";

@Injectable()

export class CriandoTarifasSemUHEspecificadoV1Service {
  constructor() { }

  /**
   * Inicializa o componente de cadastro de tarifas.
   * 
   * Esta função:
   * 1. Define o título do componente como 'Cadastrar Tarifas'.
   * 2. Recupera o nome do tarifário.
   * 3. Define o _idTarifario no objeto 'tarifasDefinidas'
   * 4. Verifica se a tarifa para o período e tipo de unidade hoteleira especificados
   *    já existe no tarifário. Se sim, atribui a tarifa existente ao objeto 'tarifasDefinidas'.
   *    Caso contrário, cria uma nova tarifa com o tipo de unidade hoteleira e período
   *    especificados.
   * 
   * @param {TarifarioV1Model} tarifarioSelecionado - O objeto do tarifário selecionado.
   * @param {TarifasV1Model} tarifasDefinidas - O objeto a ser preenchido com os valores da tarifa.
   * @param {Array<TipoUhV1Model>} listaUH - A lista de tipos de unidade hoteleira.
   * @param {Array<{label: string, value: string}>} periodos - A lista de períodos do tarifário.
   * 
   * @returns {
   *   title: string,
   *   nomeTarifario: string,
   *   tarifasDefinidas: TarifasV1Model,
   *   periodoSelecionado: string,
   *   nomeUhSelecionada: string
   * }
   */
  iniciandoComponenteCadastrandoTarifas(
    tarifarioSelecionado: TarifarioV1Model,
    tarifasDefinidas: TarifasV1Model,
    listaUH: Array<TipoUhV1Model>,
    periodos: Array<{
      label: string,
      value: string
    }>
  ) {
    const title = 'Cadastrar Tarifas';

    // Recupera o nome do tarifário
    const nomeTarifario = tarifarioSelecionado?.nomeTarifario!;

    const periodoSelecionado = periodos[0]!.value;

    const nomeUhSelecionada = listaUH[0].nomeTipoUh!;

    const tarifaExistente = tarifarioSelecionado?.tarifas.find(e =>
      e.tipoUh?.nomeTipoUh === nomeUhSelecionada
      && this.avaliarSePeriodoJaFoiCadastrado(e, periodoSelecionado)
    );

    // Atribui o tipo de unidade hoteleira ao objeto 'tarifasDefinidas'.
    if (tarifaExistente) {
      tarifasDefinidas = tarifaExistente;
    } else {
      tarifasDefinidas._idTarifario = tarifarioSelecionado?._id;
      tarifasDefinidas.tipoUh = listaUH[0];
      tarifasDefinidas = this.definindoPeriodo(periodoSelecionado, tarifasDefinidas);
    }

    return {
      title,
      nomeTarifario,
      tarifasDefinidas,
      periodoSelecionado,
      nomeUhSelecionada
    }
  }

  /**
   * Verifica se o período selecionado já foi cadastrado na tarifa informada.
   * 
   * @param {TarifasV1Model} tarifa - O objeto da tarifa a ser verificada.
   * @param {string} periodoSelecionado - O período a ser verificado.
   * @returns {boolean} - Retorna true se o período já foi cadastrado na tarifa, false caso contrário.
   */
  private avaliarSePeriodoJaFoiCadastrado(tarifa: TarifasV1Model, periodoSelecionado: string): boolean {
    // Verifica se o período é 'Alta Temporada e Feriados'
    if (tarifa.isAltaTemporadaEFeriados && periodoSelecionado === 'isAltaTemporadaEFeriados') {
      return true;
    }
    // Verifica se o período é 'Domingo a Quinta'
    else if (tarifa.isDomingoAQuinta && periodoSelecionado === 'isDomingoAQuinta') {
      return true;
    }
    // Verifica se o período é 'Quinta a Domingo'
    else if (tarifa.isQuintaADomingo && periodoSelecionado === 'isQuintaADomingo') {
      return true;
    }
    // Retorna false se nenhuma das condições for atendida
    else {
      return false;
    }
  }

  /**
   * Define o período da tarifa com base no período selecionado.
   * 
   * Verifica qual período foi selecionado e define a propriedade correspondente.
   * 
   * @param {string} periodoSelecionado - O período da tarifa a ser definido.
   * @param {TarifasV1Model} tarifasDefinidas - O objeto da tarifa a ser atualizado.
   * @returns {TarifasV1Model} - O objeto da tarifa atualizado.
   */
  private definindoPeriodo(
    periodoSelecionado: string,
    tarifasDefinidas: TarifasV1Model
  ) {
    // Determina quais períodos estão presentes no 'periodoSelecionado'
    const isDom = periodoSelecionado === 'isDomingoAQuinta';
    const isQuin = periodoSelecionado === 'isQuintaADomingo';
    const isAlt = periodoSelecionado === 'isAltaTemporadaEFeriados';

    if (isQuin) {
      // Marca o período como Quinta a Domingo
      tarifasDefinidas.isQuintaADomingo = true;
      // Remove o período como Domingo a Quinta
      tarifasDefinidas.isDomingoAQuinta = false;
      // Remove o período como Alta Temporada e Feriados
      tarifasDefinidas.isAltaTemporadaEFeriados = false;
    } else if (isDom) {
      // Marca o período como Domingo a Quinta
      tarifasDefinidas.isDomingoAQuinta = true;
      // Remove o período como Quinta a Domingo
      tarifasDefinidas.isQuintaADomingo = false;
      // Remove o período como Alta Temporada e Feriados
      tarifasDefinidas.isAltaTemporadaEFeriados = false;
    } else if (isAlt) {
      // Marca o período como Alta Temporada e Feriados
      tarifasDefinidas.isAltaTemporadaEFeriados = true;
      // Remove o período como Quinta a Domingo
      tarifasDefinidas.isQuintaADomingo = false;
      // Remove o período como Domingo a Quinta
      tarifasDefinidas.isDomingoAQuinta = false;
    }

    return tarifasDefinidas;
  }
}