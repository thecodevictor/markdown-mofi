import { RulesColaboradorV1Model } from "./rules-colaborador-v1.model";
import { RulesReservasV1Model } from "./rules-reservas-v1.model";

export class RulesAccountV1Model {
  constructor(
    public actived: boolean = true,
    /**
     * Variáveis padrões para Perfis de usuários
     */
    public isPrePerfil: boolean = true,
    public namePerfil: string = '',
    public reservado: boolean = false,

    /**
     * Menu Avatar localizado no lado superior direito da tela
     */
    public isMeuPerfilMenuAvatar: boolean = true,
    public meuPerfilMenuAvatar = new MeuPerfilMenuAvatar(),
    /**
     * Rota direcionada após o Login
     */
    public homeRoute: string = '/dashboard/mapa-diario',

    /**
     *  Itens permitidos para o usuário navegar nos menus do Dashboard
     */
    /** Permissões Módulo Colaboradores */
    public isRulesColaborador: boolean = false,
    public _rulesColaborador = new RulesColaboradorV1Model(),

    /** Permissões Módulo Reservas */
    public isRulesReservas: boolean = false,
    public _rulesReservas = new RulesReservasV1Model(),

    /** Ids */
    public _id?: string,
    public _idAccount?: string,
  ) { }
}

class MeuPerfilMenuAvatar {
  constructor(
    public updateAvatar: boolean = true,
    public updatePerfil: boolean = true,
    public updateAccesskey: boolean = true
  ) { }
}