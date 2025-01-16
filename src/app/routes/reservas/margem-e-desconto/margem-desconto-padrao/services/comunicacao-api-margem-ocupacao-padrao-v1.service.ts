import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { NewMargemOcupacaoPadraoV1Model } from "../models/new-margem-ocupacao-padrao-v1.model";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiMargemOcupacaoPadraoV1Service {

  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllMargensOcupacaoPadrao() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-ocupacao-padrao/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  PostAllMargensOcupacaoPadrao(
    margem: NewMargemOcupacaoPadraoV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/margem-ocupacao-padrao/novo`,
      margem,
      { headers: this.securityUtil.composeHeader() }
    )
  }

}
