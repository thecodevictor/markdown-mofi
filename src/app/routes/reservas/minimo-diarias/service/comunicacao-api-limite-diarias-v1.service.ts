import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EPIGRAFO_API } from 'src/app/_core/api';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LimiteDiariasV1Model } from '../models/limite-diarias-v1-model';

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiLimiteDiariasV1Service {

  constructor(
    private http: HttpClient,
    private securityUtil: SecurityUtil,
  ) { }

  getAll() {
    return this.http.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/limite-diarias/all`,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postNovoLimite(limite: LimiteDiariasV1Model) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/limite-diarias/status/true`,
      limite,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  postRemoverLimite(limite: LimiteDiariasV1Model) {
    return this.http.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/limite-diarias/status/false`,
      limite,
      { headers: this.securityUtil.composeHeader() }
    )
  }

  putUpdateLimiteDiaria(limite: LimiteDiariasV1Model) {
    return this.http.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/limite-diarias/update`,
      limite,
      { headers: this.securityUtil.composeHeader() }
    )
  }
}
