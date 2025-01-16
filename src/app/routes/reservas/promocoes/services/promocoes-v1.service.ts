import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util"; 
import { NewPromocaoV1Model } from "../models/new-promocao-v1.model";
import { PromocaoReservaV1Model } from "../models/promocao-reserva-v1.model";
import { AtivaDesativaPromocaoV1Model } from "../models/ativa-desativa-promocao-v1.model";
import { RemoveRestauraPromocaoV1Model } from "../models/remove-restaura-promocao-v1.model";
import { RemoveOrAddPeriodoTemporadaV1Model } from "../models/remove-or-add-periodo-temporada-v1-model";
import { UpdatePromocaoTemporadaV1Model } from "../models/update-promocao-temporada-v1-model";

@Injectable({
  providedIn: "root",
})
export class PromocoesV1Service {
  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil
  ) {}

  getAllPromocoes() {
    return this.http.get<ResultV1Model>(`${EPIGRAFO_API}/v1/promocao/all`, {
      headers: this.securityUtil.composeHeader(),
    });
  }

  postNewPromocao(promocao: NewPromocaoV1Model){
    return this.http.post<ResultV1Model>(`${EPIGRAFO_API}/v1/promocao`, 
      promocao,
      {headers: this.securityUtil.composeHeader()}
    );
  }

  putUpdatePromocao(promocao?: PromocaoReservaV1Model, temporada?: UpdatePromocaoTemporadaV1Model){
    return this.http.put<ResultV1Model>(`${EPIGRAFO_API}/v1/promocao/update`, 
      promocao ? promocao : temporada,
      {headers: this.securityUtil.composeHeader()}
    );
  }

  patchAtivaDesativaPromocao(data: AtivaDesativaPromocaoV1Model){
    return this.http.patch<ResultV1Model>(`${EPIGRAFO_API}/v1/promocao/active`, 
      data,
      {headers: this.securityUtil.composeHeader()}
    );
  }

  putRemoveRestauraPromocao(data: RemoveRestauraPromocaoV1Model){
    return this.http.put<ResultV1Model>(
    `${EPIGRAFO_API}/v1/promocao/remove`,
    data,
    {headers: this.securityUtil.composeHeader()}
    );
  }

  adicionaOrRemovePeriodoTemporada(
    tipo: boolean,
    data: RemoveOrAddPeriodoTemporadaV1Model
  ){
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/promocao/temporada/update/${tipo}`,
      data,
      {headers: this.securityUtil.composeHeader()}
    )
  }
}
