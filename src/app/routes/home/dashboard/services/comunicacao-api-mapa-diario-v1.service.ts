import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";

@Injectable()

export class ComunicacaoApiMapaDiarioV1Service {
  constructor(
    private securityUtil: SecurityUtil,
    private httpClient: HttpClient
  ) { }

  /**
   * @description
   * Faz uma solicitação PATCH para obter os dados do mapa diário do Adtur.
   *
   * @param {Object} datas - O intervalo de datas para o qual os dados devem ser recuperados.
   * @param {string} datas.dataInicial - A data de início no formato 'dd-MM-yyyy'.
   * @param {string} datas.dataFinal - A data de término no formato 'dd-MM-yyyy'.
   *
   * @returns {Observable<ResultV1Model>} - Um observable contendo os dados do resultado.
   */
  getMapaDiarioAdtur(
    datas: {
      dataInicial: string,    // Ex.: 00-00-0000
      dataFinal: string
    }
  ): Observable<ResultV1Model> {
    return this.httpClient.patch<ResultV1Model>(
      `${EPIGRAFO_API}/v1/mapadiario/adtur`,
      datas,
      {
        headers: this.securityUtil.composeHeader() // Adiciona cabeçalhos de autenticação
      }
    )
  }
}
