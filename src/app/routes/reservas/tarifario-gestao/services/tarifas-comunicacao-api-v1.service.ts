import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { HttpComunicacaoService } from "src/app/_core/services/http-comunicacao.service";
import { TarifasV1Model } from "../models/tarifas-v1.model";

@Injectable()

export class TarifasComunicacaoApiV1Service extends HttpComunicacaoService {
  private endpointTarifas = 'reservas/tarifario/tarifas'

  /**
   * @description
   * Atualiza as tarifas de um tarifário existente.
   * Envia uma requisição PUT para a API com base no tipo de tarifário.
   * 
   * @param {TarifasV1Model} tarifa - Os dados da tarifa a ser atualizada.
   * 
   * @returns {Observable<ResultV1Model>} - Um observable contendo o resultado da operação.
   */
  putAtualizarTarifa(tarifa: TarifasV1Model): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/${this.endpointTarifas}`,
      tarifa,
      {
        headers: this.securityUtil.composeHeader()
      }
    );
  }


  /**
   * @description
   * Exclui uma tarifa de um tarifário.
   * Envia uma requisição POST para a API com base no tipo de tarifário.
   * 
   * @param {{ _idTarifario: string, _idTarifas: string }} dados - Os dados da tarifa a ser excluída.
   * 
   * @returns {Observable<ResultV1Model>} - Um observable contendo o resultado da operação.
   */
  putExcluirTarifa(dados: {
    _idTarifario: string,
    _idTarifas: string
  }): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/${this.endpointTarifas}/remove`,
      dados,
      {
        headers: this.securityUtil.composeHeader()
      }
    );
  }
}