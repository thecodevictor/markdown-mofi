import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { DatasIndisponiveisV1Dto } from "../models/datas-indisponiveis-v1-dto";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiDatasIndisponiveisV1Service {

  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllDatas() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/datas-indisponiveis/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  disponibilizarOrIndisponibilizarData(
    status: boolean,
    dado: DatasIndisponiveisV1Dto
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/datas-indisponiveis/status/${status}`,
      dado,
      { headers: this.securityUtil.composeHeader() }
    )
  }
}
