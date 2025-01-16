import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export class CupomV1Model {
  /**
   *  Documentação para o Modelo de Dados de Cupom
   * @param excluded   // Verifica se o cupom está habilitado ou desabilitado
   * @param codecupom   // Codigo de identificação do Cupom
   * @param tpcupom   // Tipo de Cupom:
   *                     True -> é do tipo "Porcentagem"
   *                     False -> é do tipo "Valor Fixo"
   * @param porcent   // Definição de porcentagem de desconto a ser aplicada à reserva
   * @param valor   // Valor a ser descontado no total da reserva
   * @param promocional   // Cupom promocional pode ser utilizado várias vezes
   * @param reservas  // Array ou Matriz contendo os ID's das Reservas onde foi aplicado o cupom
   * @param unico   // Cupom único, se usou, tem que ser expirado
   * @param reserva   // ID da Reserva onde foi aplicado o cupom
   * @param active   // Verifica se o cupom esta ativo para uso
   *                    True -> ATIVO
   *                    False -> DESATIVADO
   * @param used   // Verifica se o cupom foi utilizado
   *                    True -> Usado
   *                    False -> Emaberto
   * @param dtinicio   // Data de Inicio do Cupom
   * @param dtfim   // Data Final do Cupom
   * @param account  // Conta de quem criou o cupom
   *
   */
  constructor(
    public _id: string,
    public excluded: boolean,
    public codecupom: string,
    public tpcupom: boolean,
    public porcent: number,
    public valor: number,
    public promocional: boolean,
    public reservas: number[],
    public unico: boolean,
    public reserva: number,
    public active: boolean,
    public used: boolean,
    public dtinicio: string,
    public dtfim: string,
    public account: AccountV1Model
  ) {}
}
