import { TarifasV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tarifas-v1.model";
import { TipoUhV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tipo-uh-v1.model";

export interface TabelaFiltradaV1Model {
  todos: TipoUhV1Model[] | TarifasV1Model[],
  excluidos: TipoUhV1Model[] | TarifasV1Model[],
  validos: TipoUhV1Model[] | TarifasV1Model[],
  ativos: TipoUhV1Model[] | TarifasV1Model[],
  desativados: TipoUhV1Model[] | TarifasV1Model[],
  filtrado: TipoUhV1Model[] | TarifasV1Model[],
  tipoTabela: string
}