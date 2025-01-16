import { DatasV1Model } from "./datas-v1.model";

export class DatasIndisponiveisV1Dto {
  constructor(
    public _id?: string,
    public datasIndisp?: DatasV1Model[]
  ) { }
}
