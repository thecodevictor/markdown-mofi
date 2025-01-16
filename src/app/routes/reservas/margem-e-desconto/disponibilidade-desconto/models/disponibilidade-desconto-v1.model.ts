import { AccountV1Model } from "src/app/_core/models/account-v1.model";
import { DescontoV1Model } from "./desconto-v1.model";

export class DisponibilidadeDescontoV1Model {
  /**
      -- Documentação --
      @param dtInicio         // Data de inicio da disponibilidade
      @param dtFim            // Data final da disponibilidade
      @param desconto         // Porcentagens das margens de desconto e ocupação
      @param _account         // É utilizado para auditoria para verificar qual conta de usuário realizou os
                                 processos na disponibilidade de desconto
  */
  constructor(
    public _id: string,
    public dtInicio: Date,
    public dtFim: Date,
    public desconto: [DescontoV1Model],
    public _account: AccountV1Model
  ) { }
}

