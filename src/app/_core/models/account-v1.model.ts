import { RulesAccountV1Model } from "src/app/routes/colaboradores/permissoes/models/rules-account-v1.model";
import { AvatarV1Model } from "./avatar-v1.model";
import { ClienteEmpresaV1Model } from "./cliente-empresa-v1.model";
import { UserV1Model } from "./user-v1.model";

export class AccountV1Model {
  /**
 * model da conta de usuário COLABORADORES Hotel CTC
 *
 * @param _id                 # id (Chave) único criado pelo banco de dados
 * @param excluded            # FALSE a conta esta normal, TRUE a conta não pode ter acesso ao sistema, dada como excluida
 * @param nome                # Nome completo da conta
 * @param telefone            # Telefone de contato formato: (00) 000-000-000
 * @param _avatar              # Avatar do usuário
 * @param _user                # User de acesso ao dashboard
 * @param tpAccount           # Tipo de conta:
 *                              colaborador,
 *                              empresa,
 *                              app,
 *                              webService
 * @param _empresaAccount     # Objeto de dados de Conta de Empresa
 * @param _rulesAccount       # Objeto de dados de permissões de contas
 *
 */

  constructor(
    public _id: string,
    public excluded: boolean,

    /** Detalhes do ACCOUNT Hotel CTC */
    public nome: string,
    public telefone: string,
    public _avatar: AvatarV1Model,
    public _user: UserV1Model,
    public tpAccount: string[],

    /** Detalhes da Conta de Empresa */
    public _empresaAccount: ClienteEmpresaV1Model,

    /** id Rules Account */
    public _rulesAccount: RulesAccountV1Model,

    /** _id Account de registro ao sistema referente ao cliente */
    public _idAccount?: string
  ) { }
}


// /** id (Chave) único criado pelo banco de dados */
// public _id: string,

// /** _id Account de registro ao sistema referente ao cliente */
// public _idAccount: string,

// /** contas reservadas do sistema Epigrafo      */
// public reservado: boolean,

// /** FALSE a conta esta normal, TRUE a conta não pode ter acesso ao sistema, dada como excluida */
// public excluded: boolean,

// /** Nome completo da conta */
// public nome: string,

// /** Telefone de contato formato: (00) 000-000-000 */
// public telefone: string,

// /** Avatar do usuário */
// public _avatar: AvatarV1Model,

// /** Objeto de dados de Conta de Empresa */
// public _user: UserV1Model,