import { RulesAccountV1Model } from "../permissoes/models/rules-account-v1.model";

export class UpdateAccountColaboradorV1Model {
  /**
   * DTO de criação de nova conta colaborador
   *
   * @param _id         # id (Chave) único criado pelo banco de dados
   * @param _userId     # id user para alteração do apelido
   * @param nome        # Nome completo da conta
   * @param telefone    # telefone de contato formato: (00) 000-000-000
   * @param apelido     # Apelido da conta informada pelo user o registro
   */
  constructor(
    public _id: string = '',
    public _userId: string = '',
    public nome: string = '',
    public telefone: string = '',
    public apelido: string = '',
    public _rulesAccount: string = ''
  ) { }
}
