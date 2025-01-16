import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export class TemporadaV1Model {
  constructor(
    public dtEntrada: Date,
    public dtSaida: Date,
    public obs: string,
    public _id?: string,
    public excluded?: boolean,
    public dtCriada?: Date,
    public dtExcluida?: Date,
    public _Account?: AccountV1Model
  ) { }
}