import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { NewDisponibilidadeDescontoV1Model } from "../models/new-disponibilidade-desconto-v1.model";
import { NewMargemDisponibilidadeDescontoV1Model } from "../models/new-margem-disponibilidade-desconto-v1.model";
import { RemoveDescontoMargemV1Model } from "../models/remove-desconto-margem-v1.model";
import { UpdateMargemDispDescV1Model } from "../models/update-margem-disp-desc-v1.model";
import { UpdtadeMargemDisponibilidadeDescontoV1Model } from "../models/update-margem-disponibilidade-desconto-v1.model.ts";
@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiDisponibilidadeDescontoV1Service {
  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAllDisponDesconto() {
    return this.http.get(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  getByIdDisponDesconto(
    id: string
  ) {
    return this.http.get(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/id/${id}`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewDisponDesconto(
    newDisponDesconto: NewDisponibilidadeDescontoV1Model
  ) {
    return this.http.post(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/novo`,
      newDisponDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putUpdateDisponDesconto(
    DisponDesconto: UpdtadeMargemDisponibilidadeDescontoV1Model
  ) {
    return this.http.put(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/update`,
      DisponDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNewMargemDispDesc(
    newDisponDesconto: NewMargemDisponibilidadeDescontoV1Model
  ) {
    return this.http.post(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/margem/novo`,
      newDisponDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putUpdateMargemDispoDesc(
    DisponDesconto: UpdateMargemDispDescV1Model
  ) {
    return this.http.put(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/margem/update`,
      DisponDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putRemoveMargemDispoDesc(
    DisponDesconto: RemoveDescontoMargemV1Model
  ) {
    return this.http.put(
      `${EPIGRAFO_API}/v1/reservas/disp-desc-periodo/margem/remove`,
      DisponDesconto,
      { headers: this.securityUtil.composeHeader() }
    )
  }

}


