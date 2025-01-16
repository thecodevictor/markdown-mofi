import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { NewMargemDescontoDiarioV1Model } from "../models/new-margem-desconto-diario-v1.model";
import { ExcludedMargensV1Model } from "../models/excluded-margens-v1.model";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiMargemDescontoDiarioV1Service {
  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllMargemDescDiario() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-desconto-diario/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postMargemDescDiario(
    margemDesconto: NewMargemDescontoDiarioV1Model,
    status: boolean
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-desconto-diario/novo/${status}`,
      margemDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putMargemDescDiario(
    margemDesconto: ExcludedMargensV1Model,
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-desconto-diario/excluded`,
      margemDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

}


