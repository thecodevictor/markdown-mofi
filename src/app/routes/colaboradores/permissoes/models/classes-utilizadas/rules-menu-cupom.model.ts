export class RulesMenuCupom {
  constructor(
    public isSubMenuCupomIndividual: boolean = false,
    public rulesCupomUnico = new RulesCupomIndividual(),
    public isSubMenuCupomPromocional: boolean = false,
    public rulesCupomPromocional = new RulesCupomPromocional(),
    public isSubMenuCupomTemporada: boolean = false,
    public rulesCupomTemporada = new RulesCupomTemporada(),
    public isSubMenuVouchers: boolean = false,
    public rulesVouchers?: {
      rv_isNewVouchers: boolean,
      rv_isLockVouchers: boolean,
      rv_isUpdateVouchers: boolean,
      rv_DetalhesVouchers: boolean,
      rv_isDeleteVouchers: boolean,
      rv_isListaVouchersExcluidos: boolean,
      rv_isRestoreVouchersExcluidos: boolean
    }
  ) { }
}

export class RulesCupomPromocional {
  constructor(
    public rcp_isNewCupomPromocional: boolean = false,
    public rcp_isLockCupomPromocional: boolean = false,
    public rcp_isUpdateCupomPromocional: boolean = false,
    public rcp_DetalhesCupomPromocional: boolean = false,
    public rcp_isDeleteCupomPromocional: boolean = false,
    public rcp_isListaCuponsDeletados: boolean = false,
    public rcp_isRestoreCuponsDeletados: boolean = false
  ) { }
}
export class RulesCupomIndividual {
  constructor(
    public rcu_isNewCupomUnico: boolean = false,
    public rcu_isLockCupomUnico: boolean = false,
    public rcu_isUpdateCupomUnico: boolean = false,
    public rcu_DetalhesCupomUnico: boolean = false,
    public rcu_isDeleteCupomUnico: boolean = false,
    public rcu_isListaCuponsDeletados: boolean = false,
    public rcu_isRestoreCuponsDeletados: boolean = false
  ) { }
}

export class RulesCupomTemporada {
  constructor(
    public rct_isNewCupomTemporada: boolean = false,
    public rct_isLockCupomTemporada: boolean = false,
    public rct_isUpdateCupomTemporada: boolean = false,
    public rct_DetalhesCupomTemporada: boolean = false,
    public rct_isDeleteCupomTemporada: boolean = false,
    public rct_isListaCuponsDeletados: boolean = false,
    public rct_isRestoreCuponsDeletados: boolean = false
  ) { }
}