import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export class MargemDescontoPadraoV1Model {
  /**
   * -- Documentação --
   * Margem de Desconto pré-definido caso não tenha definição por dia a dia
   *
   * @param _id              // código id gerado pelo mongoDB
   * @param margemDesconto   // margem padrão de desconto
   * @param status           // TRUE -> é a margem atual em uso
   *                            FALSE -> é a margem anterior à atual
   * @param dtEncerramento   // data de encerramento de uso da margem de desconto atual, sendo lançado
   *                            quando se cria uma nova margem de desconto.
   * @param _account         // identificação do usuário logado
   *
  */

  constructor(
    public _id: string,
    public margemDesconto: number,
    public status: boolean,
    public dtEncerramento: Date,
    public _account: AccountV1Model
  ) { }
}
