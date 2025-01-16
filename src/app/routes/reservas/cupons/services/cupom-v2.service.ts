
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { CupomUnicoV1Model } from "../models/cupom-unico-v1.model";
import { ActiveCupomV1Model } from "../models/active-cupom-v1-model";
import { CupomPromocionalV1Model } from "../models/cupom-promocional-v1.model";
import { RemoveCupomV1Model } from "../models/remove-cupom-v1-model";
import { CupomV2Model } from "../models/cupom-v2.model";
import { CupomTemporadaV1Model } from "../models/cupom-temporada-v1-model";
import { RemoveOrAddPeriodoV1Model } from "../models/remove-periodo-v1-model";

@Injectable({
  providedIn: 'root'
})
export class CupomV2Service {

  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllCupons() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewCupomPromocional(
    cupom: CupomPromocionalV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/promocional`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewCupomUnico(
    cupom: CupomUnicoV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/unico`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  
  postNewCupomTemporada(
    cupom: CupomTemporadaV1Model
  ) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/temporada`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  updateCupom(
    cupom: CupomV2Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/update`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  activedAndDesactivedCupomUnico(
    cupom: ActiveCupomV1Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/active-desactive`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  removeRestauraCupom(
    cupom: RemoveCupomV1Model
  ) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v2/cupom/remove`,
      cupom,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  adicionaOrRemovePeriodoTemporada(
    tipo: boolean,
    data: RemoveOrAddPeriodoV1Model
  ){
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/cupom/temporada/update/${tipo}`,
      data,
      {headers: this.securityUtil.composeHeader()}
    )
  }
}
