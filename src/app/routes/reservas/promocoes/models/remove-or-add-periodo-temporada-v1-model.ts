import { PromocaoTemporadaV1Model } from "./promocao-temporada-v1.model";

export class RemoveOrAddPeriodoTemporadaV1Model {
  constructor(
    public _idPromocao: string,
    public _idTemporada?: string,
    public temporada?: PromocaoTemporadaV1Model[]
  ) {}
}
