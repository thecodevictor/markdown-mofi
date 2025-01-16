import { MargemOcupacaoDiarioV1Model } from "src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-ocupacao-diario-v1.model";
import { MargemOcupacaoPadraoV1Model } from "src/app/routes/reservas/margem-e-desconto/margem-desconto-padrao/models/margem-ocupacao-padrao-v1.model";

export interface MapMargemOcupacaoV1Model {
  data: string,
  isPadrao: boolean,
  margemOcupacaoPadrao: MargemOcupacaoPadraoV1Model,
  margemOcupacaoDiario: MargemOcupacaoDiarioV1Model
}