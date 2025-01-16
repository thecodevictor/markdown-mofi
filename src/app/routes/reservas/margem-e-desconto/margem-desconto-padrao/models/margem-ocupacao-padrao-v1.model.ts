import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export interface MargemOcupacaoPadraoV1Model {
  _id: string;
  margemOcupacao: number;
  status: boolean;
  dtEncerramento: Date;
  _account: AccountV1Model;
}

