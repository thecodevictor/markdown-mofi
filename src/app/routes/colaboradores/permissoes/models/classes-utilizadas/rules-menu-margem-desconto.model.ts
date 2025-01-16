export class RulesMenuMargemDesconto {
  constructor(
    public isSubMenuDisponibilidadeDesconto: boolean = false,
    public rulesMenuDisponibilidadeDesconto = new RulesMargemDisponibilidadeDesconto(),
    public isSubMenuMargemDescontoDiario: boolean = false,
    public rulesMargemDescontoDiario = new RulesMargemDescontoDiario(),
    public isSubMenuMargemOcupacaoDiario: boolean = false,
    public rulesMargemOcupacaoDiario = new RulesMargemOcupacaoDiaria(),
    public isSubMenuMargemDescontoPadrao: boolean = false,
    public rulesMargemDescontoPadrao = new RulesMargemDescontoPadrao(),
    public isSubMenuMargemOcupacaoPadrao: boolean = false,
    public rulesMargemOcupacaoPadrao = new RulesMargemOcupacaoPadrao()
  ) { }
}

export class RulesMargemDisponibilidadeDesconto {
  constructor(
    public rmdd_isNewDisponibilidadeDesconto: boolean = false,
    public rmdd_isUpdateDisponibilidadeDesconto: boolean = false,
    public rmdd_isInserirMargens: boolean = false
  ) { }
}

export class RulesMargemDescontoDiario {
  constructor(
    public rmdd_isNewMargemDescontoDiario: boolean = false,
    public rmdd_isUpdateMargemDescontoDiario: boolean = false,
    public rmdd_isDeleteMargemDescontoDiario: boolean = false,
    public rmdd_visualizarMargemDescontoDiarioExcluido: boolean = false
  ) { }
}

export class RulesMargemOcupacaoDiaria {
  constructor(
    public rmod_isNewMargemOcupacaoDiario: boolean = false,
    public rmod_isUpdateMargemOcupacaoDiario: boolean = false,
    public rmod_isDeleteMargemOcupacaoDiario: boolean = false,
    public rmod_visualizarMargemOcupacaoDiarioExcluido: boolean = false
  ) { }
}

export class RulesMargemDescontoPadrao {
  constructor(
    public rmdp_isNewMargemDescontoPadrao: boolean = false
  ) { }
}

export class RulesMargemOcupacaoPadrao {
  constructor(
    public rmop_isNewMargemOcupacaoPadrao: boolean = false
  ) { }
}