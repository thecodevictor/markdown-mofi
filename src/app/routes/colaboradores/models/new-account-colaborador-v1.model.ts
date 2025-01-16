//import { RulesAccountV1Model } from "../permissoes/model/rules-account-v1.model";

export class NewAccountColaboradorV1Model {
  /**
   * DTO de criação de nova ACCOUNT
   *
   * @param apelido       # nome que será mostrado na tela
   * @param email         # e-mail de acesso ao Hotel CTC colaborador
   * @param accesskey     # chave de acesso
   * @param telefone      # número de telefone
   * @param isRulesPerfil # Verifica se e um pre perfil existente ou personalisado
   * @param rulesAccount  # Objeto de dados de permissões de Account
   */

  constructor(
    public apelido: string,
    public email: string,
    public telefone: string,
    public accesskey: string,
    public isRulesPerfil: boolean,
    public rulesAccount: string
  ) { }
}
