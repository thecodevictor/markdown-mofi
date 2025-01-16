import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/api";
import { ResultV1Model } from "src/app/core/models/result-v1.model";
import { SecurityUtil } from "src/app/core/utils/security.util";
import { CupomV1Model } from "../models/cupom-v1.model";
import { CupomUnicoV1Model } from "../models/cupom-unico-v1.model";
import { ActiveCupomV1Model } from "../models/active-cupom-v1-model";
import { CupomPromocionalV1Model } from "../models/cupom-promocional-v1.model";
import { RemoveCupomV1Model } from "../models/remove-cupom-v1-model";

@Injectable({
  providedIn: 'root'
})
export class CupomV1Service {

  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllCupons() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewCupomPromocional(
    cupom: CupomPromocionalV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/promocional`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewCupomUnico(
    cupom: CupomUnicoV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/unico`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  updateCupom(
    cupom: CupomV1Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/update`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  activedAndDesactivedCupomUnico(
    cupom: ActiveCupomV1Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/active-desactive`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  removeRestauraCupom(
    cupom: RemoveCupomV1Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/remove`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }
}
