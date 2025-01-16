import { AccountV1Model } from "src/app/_core/models/account-v1.model"
import { TarifasV1Model } from "./tarifas-v1.model"

export interface TarifarioV1Model {
  _id: string;
  _idAccount: string;
  excluded: boolean;
  actived: boolean;
  isParticular: boolean;
  isGrupo: boolean;
  dtInicio: Date;
  dtFinal: Date;
  nomeTarifario: string;
  tarifas: TarifasV1Model[];
  regrasEBloqueios: {
    quantidadeMinEMaxDiarias: {
      isQuantidadeMinima: boolean,
      quantidadeMinima: number,
      isQuantidadeMaxima: boolean,
      quantidadeMaxima: number
    }
  };
  _account: AccountV1Model;
}