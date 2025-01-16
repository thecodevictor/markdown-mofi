import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export class LimiteDiariasV1Model {
  constructor(
    public _id?: string,
    public _idAccount?: string,
    public excluded?: boolean,
    public data?: string,
    public minimo?: number,
    public maximo?: number,
    public _account?: AccountV1Model
  ) { }
}