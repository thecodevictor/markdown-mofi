import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { NewMargemOcupacaoDiarioV1Model } from "../models/new-margem-ocupacao-diario-v1.model";
import { ExcludedMargensV1Model } from "../models/excluded-margens-v1.model";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiMargemOcupacaoDiarioV1Service {
  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllMargemcupacaoDiario() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-ocupacao-diario/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postMargemOcupacaoDiario(
    margem: NewMargemOcupacaoDiarioV1Model,
    status: boolean
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-ocupacao-diario/novo/${status}`,
      margem,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putMargemOcupacaoDiario(
    margemDesconto: ExcludedMargensV1Model,
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-ocupacao-diario/excluded`,
      margemDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

}


