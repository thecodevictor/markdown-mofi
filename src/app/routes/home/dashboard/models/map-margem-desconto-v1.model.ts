import { MargemDescontoDiarioV1Model } from "src/app/routes/reservas/margem-e-desconto/margem-desconto-diario/models/margem-desconto-diario-v1.model";
import { MargemDescontoPadraoV1Model } from "src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-desconto-padrao-v1.model";

export interface MapMargemDescontoV1Model {
  data: string,
  isPadrao: boolean,
  margemDescontoPadrao: MargemDescontoPadraoV1Model,
  margemDescontoDiario: MargemDescontoDiarioV1Model
}