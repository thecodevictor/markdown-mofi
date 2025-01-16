export class CupomPromocionalV1Model {
  /**
   *  Documentação para o Modelo de Dados de Cupom
   * @param codecupom   // Codigo de identificação do Cupom
   * @param tpcupom   // Tipo de Cupom:
   *                     True -> é do tipo "Porcentagem"
   *                     False -> é do tipo "Valor Fixo"
   * @param porcent   // Definição de porcentagem de desconto a ser aplicada à reserva
   * @param valor   // Valor a ser descontado no total da reserva
   * @param promocional   // Cupom único, se usou, tem que ser expirado
   * @param dtinicio   // Data de Inicio do Cupom
   * @param dtfim   // Data Final do Cupom
   *
   */
  constructor(
    public codecupom: string,
    public tpcupom: boolean,
    public porcent: number,
    public valor: number,
    public promocional: boolean,
    public dtinicio: Date,
    public dtfim: Date
  ) { }
}
