import { LimiteDiariasV1Model } from "src/app/routes/reservas/minimo-diarias/models/limite-diarias-v1-model";

export class MapLimitesDiariasModel {
  constructor(
    public data: string,
    public limite?: LimiteDiariasV1Model
  ) { }
}
