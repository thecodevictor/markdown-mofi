import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { NovoTarifarioV1Interface } from "src/app/routes/reservas/tarifario-gestao/components/form-tarifario/form-tarifario.component";
import { TipoUhV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tipo-uh-v1.model";

@Injectable()

export class ComunicacaoApiTarifarioV1Service {
  constructor(
    private securityUtil: SecurityUtil,
    private httpClient: HttpClient
  ) { }

  private endpointTarifarioGp = 'reservas/tarifario/grupo'
  private endpointTarifarioPv = 'reservas/tarifario/particular'

  /**
   * @description
   * Recupera o tarifário de todos os hotéis do Adtur.
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiMapaDiarioV1Service
   */
  getTarifarioAdtur(): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/tarifario/all`,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Recupera o tarifário pelo ID do mesmo.
   * @param {string} id ID do tarifário.
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  getTarifarioById(id: string): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/tarifario/busca/${id}`,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Recupera a lista de Unidades Hoteleiras
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  getListaUh(): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/tipouh`,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Envia o formulário para a API com base no tipo de tarifário.
   * Se for particular, envia para a rota de cadastro de tarifário particular.
   * Se for de grupo, envia para a rota de cadastro de tarifário de grupo.
   * @param {NovoTarifarioV1Interface} model Dados do formulário.
   * @param {boolean} [isParticular=false] Se é um tarifário particular.
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  postNovoTarifario(model: NovoTarifarioV1Interface, isParticular: boolean): Observable<ResultV1Model> {
    return this.httpClient.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/${isParticular ? this.endpointTarifarioPv : this.endpointTarifarioGp}/new`,
      model,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Envia uma solicitação para a API para cadastrar ou editar uma nova Unidade Hoteleira.
   * @param {TipoUhV1Model} uh Dados da Unidade Hoteleira.
   * @param {'update' | 'new'} acao Ação que sera executada na API. Se for 'new', cadastra uma nova Unidade Hoteleira.
   *                                Se for 'update', atualiza uma Unidade Hoteleira existente.
   * @returns {Observable<ResultV1Model>} Retorna um Observable com o resultado da solicitação.
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  criarOuEditarUH(uh: TipoUhV1Model, acao: 'update' | 'new'): Observable<ResultV1Model> {
    return this.httpClient.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/tipouh/${acao}`,
      uh,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Realiza a exclusão ou habilitação de um tarifário.
   * @param {{ _id: string; excluded: boolean; }} data Dados do tarifário.
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  excluiOuHabilitaTarifario(data: {
    _id: string;
    excluded: boolean;
  }): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/tarifario/excluded`,
      data,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * @description
   * Ativa ou desativa um tarifário.
   * @param {{ _id: string; actived: boolean; }} data Dados do tarifário.
   * @returns {Observable<ResultV1Model>}
   * @memberof ComunicacaoApiTarifarioV1Service
   */
  ativaOuDesativaTarifario(data: {
    _id: string;
    actived: boolean;
  }): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/reservas/tarifario/active-disable`,
      data,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }
}