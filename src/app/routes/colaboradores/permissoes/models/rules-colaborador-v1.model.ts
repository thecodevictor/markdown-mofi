import { RulesMenuContasWeb } from "./classes-utilizadas/rules-menu-contas-web.model";

export class RulesColaboradorV1Model {
  /**
   * Class RulesColaboradorV1Model
   * @description Essa classe abriga as permissões para o módulo de Colaboradores
   * @constructor
   * @param {boolean} [excluded=false] - Flag para indicar se o item deve ser excluído das permissões
   * @param {boolean} [isContasWebMenu=false] - Flag para indicar se o item de menu "Contas Web" deve ser exibido
   * @param {RulesMenuContasWeb} [contasWebMenu=new RulesMenuContasWeb()] - Objeto que abriga as permissões para o item de menu "Contas Web"
   * @param {string} [_id] - Id do registro no banco de dados
   * @param {string} [_idAccount] - Id da conta que o registro pertence
   */
  constructor(
    public excluded: boolean = false,
    public isContasWebMenu: boolean = false,
    public contasWebMenu: RulesMenuContasWeb = new RulesMenuContasWeb(),
    public _id?: string,
    public _idAccount?: string,
  ) { }
}
