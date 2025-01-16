import { RulesMenuCupom } from "./classes-utilizadas/rules-menu-cupom.model"
import { RulesMenuMargemDesconto } from "./classes-utilizadas/rules-menu-margem-desconto.model"

export class RulesReservasV1Model {
  constructor(
    public isMenuCupom = false,
    public menuCupom = new RulesMenuCupom(),
    public isMenuMargemDesconto = false,
    public menuMargemDesconto = new RulesMenuMargemDesconto(),
    public isMenuDatasIndisponiveis = false,
    public menuDatasIndisponiveis: {
      rulesDatasIndisponiveis: RulesDatasIndisponiveis
    } = {
        rulesDatasIndisponiveis: new RulesDatasIndisponiveis()
      },
    public isMenuPromocoes = false,
    public menuPromocoes: {
      rulesPromocoes: RulesPromocoes
    } = { rulesPromocoes: new RulesPromocoes() },
    public isMenuMinimoDiarias = false,
    public menuMinimoDiarias: {
      rulesMinimoDiarias: RulesLimiteDiarias
    } = {
        rulesMinimoDiarias: new RulesLimiteDiarias()
      },
    public _id?: string,
    public _idAccount?: string,
    public excluded?: boolean,
  ) { }
}

export class RulesDatasIndisponiveis {
  constructor(
    public rdi_isNewOrIsNotDataIndisponivel = false
  ) { }
}

export class RulesPromocoes {
  constructor(
    public rp_isNewPromocao = false,
    public rp_isLockAndUnlockPromocao = false,
    public rp_isUpdatePromocao = false,
    public rp_isDetalhesPromocao = false,
    public rp_isDeletePromocao = false,
    public rp_isRestorePromocao = false,
    public rp_isListaPromocao = false,
  ) { }
}

export class RulesLimiteDiarias {
  constructor(
    public rmd_isNewMinimoDiarias: boolean = false,
    public rmd_isUpdateMinimoDiarias: boolean = false,
    public rmd_isDeleteMinimoDiarias: boolean = false,
    public rmd_visualizarMinimoDiariasExcluido: boolean = false
  ) { }
}