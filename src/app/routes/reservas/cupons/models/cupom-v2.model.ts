import { AccountV1Model } from "src/app/_core/models/account-v1.model";
import { TemporadaV1Model } from "./temporada-v1-model";

/**
 *  Documentação para o Modelo de Dados de Cupom
 *
 * @param _idAccount     // _id Account de registro ao sistema referente ao cliente
 * @param excluded       // Verifica se o cupom esta habilitado/desabilitado
 *                            True -> desabilitado
 *                            False -> habilitado
 * @param codecupom      // Codigo de identificação do Cupom
 * @param tpcupom        // Tipo de Cupom:
 *                            True -> é do tipo "Porcentagem"
 *                            False -> é do tipo "Valor Fixo"
 * @param porcent        // Definição de porcentagem de desconto a ser aplicada à reserva
 * @param valor          // Valor a ser descontado no total da reserva
 * @param promocional    // Cupom promocional pode ser utilizado várias vezes
 * @param unico          // Cupom único, se usou, tem que ser expirado
 * @param active         // Verifica se o cupom esta ativo para uso
 *                            True -> ATIVO
 *                            False -> DESATIVADO
 * @param used           // Verifica se o cupom foi utilizado
 *                            True -> Usado
 *                            False -> Em aberto
 * @param dtinicio       // Data de Inicio do Cupom
 * @param dtfim          // Data Final do Cupom
 * @param isTemporada    // Condição se o cupom Temporada é TRUE ou FALSE
 * @param temporada      // Um Array contendo os períodos que o cupom abrange
 * @param _Account       // Dados do user autenticado
 *
 */

export class CupomV2Model {
  constructor(
    public _id: string,
    public _idAccount: string,
    public excluded: boolean,
    public codecupom: string,
    public tpcupom: boolean,
    public porcent: number,
    public valor: number,
    public promocional: boolean,
    public unico: boolean,
    public isTemporada: boolean,
    public active: boolean,
    public _Account: AccountV1Model,
    public used?: boolean,
    public dtinicio?: Date,
    public dtfim?: Date,
    public temporada?: TemporadaV1Model[],
  ) { }
}
