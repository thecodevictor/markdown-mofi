import { TarifasV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tarifas-v1.model";
import { TipoUhV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tipo-uh-v1.model";

export interface TarifarioAgrupadoV1Interface {
  tipoUh: TipoUhV1Model;
  tarifas: TarifasV1Model[];
}