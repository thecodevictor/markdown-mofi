import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EPIGRAFO_API } from "src/app/_core/api";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { HttpComunicacaoService } from "src/app/_core/services/http-comunicacao.service";
import { RulesAccountV1Model } from "../models/rules-account-v1.model";

@Injectable()

export class ComunicacaoApiPermissoesV1Service extends HttpComunicacaoService {

  /**
   * Obtém todas as permissões de acesso
   * existentes na base de dados
   * @returns Um Observable com o resultado da operação
   */
  getTodasPermissoes(): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/rules/account/all`,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  /**
   * Ativa ou desativa um perfil de permissão
   * @param dados Informações do perfil a ser alterado
   * @returns Um Observable com o resultado da operação
   */
  putAtivarDesativarPerfil(dados: {
    id: string,
    actived: boolean
  }): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/rules/account/bloqueia`,
      dados,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }

  postNovoPerfilPermissao(perfil: RulesAccountV1Model): Observable<ResultV1Model> {
    return this.httpClient.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/rules/account/new`,
      perfil,
      {
        headers: this.securityUtil.composeHeader()
      }
    )
  }
}