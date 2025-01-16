export class HeaderAppsModel {
  /**
   * model de permissão de acesso aos
   * apps disponíveos no sistema
   * @iscolaborador     # permissão para acessar app colaboradores
   * @isautomacao       # permissão para acessar app automação
   * @isconfiguracoes   # permissão para acessar app configurações
   * @isempresas        # permissão para acessar app empresas
   * @isescritafiscal   # permissão para acessar app escritafiscal
   * @iscontabilidade   # permissão para acessar app contabilidade
   * @isprocessos       # permissão para acessar app processos
   * @isadministrativo  # permissão para acessar app admisnitrativo
   * @isrelatorios      # permissão para acessar app relatorios
   */
  constructor(
    public iscolaborador: boolean,
    // public isautomacao: boolean,
    // public isconfiguracoes: boolean,
    // public isempresas: boolean,
    // public isescritafiscal: boolean,
    // public iscontabilidade: boolean,
    // public isprocessos: boolean,
    // public isadministrativo: boolean,
    // public isrelatorios: boolean
  ) { }
}
