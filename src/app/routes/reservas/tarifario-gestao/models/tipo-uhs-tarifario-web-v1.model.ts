import { ValoresPaxV1Model } from "./valores-pax-v1.model";

export class TipoUhsTarifarioWebV1Model {
  constructor(
    public Nome: string,
    public TiposPensaoPermitidos: string,
    public ValoresPAX: ValoresPaxV1Model[]
  ) { }
}
