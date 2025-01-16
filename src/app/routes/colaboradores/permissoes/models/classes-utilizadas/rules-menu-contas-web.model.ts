export class RulesMenuContasWeb {
  constructor(
    public isListaContasWeb: boolean = false,
    public rulesListaContasWeb = new RulesListaContasWeb(),
    /**
     * Permissões de acesso aos itens de menu Permissões
     */
    public isPerfisPermissoes: boolean = false,
    public rulesPerfisPermissoes = new RulesPerfisPermissoes(),
    public isNovoPerfil: boolean = false,
    public rulesNovoPerfis = new RulesNovoPerfil()
  ) { }
}

export class RulesListaContasWeb {
  constructor(
    public rlcw_isUpdateColaborador: boolean = false,
    public rlcw_isNewColaborador: boolean = false,
    public rlcw_isLockColaborador: boolean = false,
    public rlcw_UpdateColaborador = new RulesUpdateColaborador(),
    public rlcw_isDeleteColaborador: boolean = false,
    public rlcw_visualizarColaboradorExcluido: boolean = false,
    public rlcw_isRestoreColaboradorExcluido: boolean = false
  ) { }
}

export class RulesUpdateColaborador {
  constructor(
    public updateDadosColaborador: boolean = false,
    public updateAccesskeyColaborador: boolean = false,
    public updateAvatarColaborador: boolean = false,
    public updatePermissao: boolean = false
  ) { }
}

export class RulesPerfisPermissoes {
  constructor(
    public rpp_isNewPerfilPermissao: boolean = false,
    public rpp_isUpdatePermissao: boolean = false,
    public rpp_isDetahesPermissao: boolean = false,
    public rpp_isLockPermissao: boolean = false,
    public rpp_isListaColaboradoresPermissao: boolean = false
  ) { }
}

export class RulesNovoPerfil {
  constructor(
    public rnp_isColaborador: boolean = false,
    public rnp_isReservas: boolean = false,
    public rnp_isPortal: boolean = false,
    public rnp_isGateway: boolean = false,
    public rnp_isConfiguracoes: boolean = false,
    public rnp_isCallegario: boolean = false,
    public rnp_isHospedes: boolean = false
  ) { }
}