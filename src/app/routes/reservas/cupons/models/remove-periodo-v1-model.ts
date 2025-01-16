import { TemporadaV1Model } from "./temporada-v1-model";

export class RemoveOrAddPeriodoV1Model {
  constructor(
    public _idCupom: string, 
    public _idTemporada?: string,
    public temporada?: TemporadaV1Model[]
  ) {}
}
