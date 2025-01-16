export class RulesVisualizarTarifario {
  rvt_isNewTarifario: boolean = false // pode adicionar novo tarifario
  rvt_isVisualizarTarifario: boolean = false // pode visualizar tarifario
}

export class RulesGestaoTarifario {
  rgt_isNewTarifario: boolean = false // pode adicionar novo tarifario
  rgt_isVisualizarTarifario: boolean = false // pode visualizar tarifario
  rgt_isEditarTarifario: boolean = false // pode editar tarifario
  rgt_isExcluirERestaurarTarifario: boolean = false // pode excluir e restaurar tarifario
  rgt_isAtivarEDesativarTarifario: boolean = false // pode ativar e desativar tarifario
  rgt_isAdicionarTarifas: boolean = false // pode adicionar tarifas
  rgt_isEditarTarifas: boolean = false // pode editar tarifas
  rgt_isExcluirTarifas: boolean = false // pode excluir tarifas
}

export class RulesUnidadesHoteleiras {
  ruh_isNovaUnidadeHoteleira: boolean = false // pode adicionar nova unidade hoteleira
  ruh_isEditarUnidadeHoteleira: boolean = false // pode editar uma unidade hoteleira
}