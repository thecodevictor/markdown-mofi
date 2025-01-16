import { Injectable } from "@angular/core";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { EPIGRAFO_API } from "src/app/_core/api";
import { NewAccountColaboradorV1Model } from "../models/new-account-colaborador-v1.model";
import { Observable } from "rxjs";
import { HttpComunicacaoService } from "src/app/_core/services/http-comunicacao.service";
import { ActiveAndDisabledAccountV1Model } from "../models/active-and-disabled-account-v1.model";
import { RemoveAccountAndUserModel } from "../models/remove-account-and-user.model";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoApiGestaoContasV1Service extends HttpComunicacaoService {
  /**
   * Realiza uma requisição para criar uma nova conta de colaborador
   *
   * @param novaConta Objeto com as informações da conta a ser criada
   * @returns Um observable com o resultado da operação
   */
  postNovaConta(novaConta: NewAccountColaboradorV1Model): Observable<ResultV1Model> {
    return this.httpClient.post<ResultV1Model>(
      `${EPIGRAFO_API}/v1/colaborador/newaccount`,
      novaConta,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Realiza uma requisição para buscar a lista de contas de usuários
   *
   * @returns Um observable com o resultado da operação
   */
  getListaContas(): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/all`,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Realiza uma requisição para ativar ou desativar uma conta de usuário.
   * 
   * @param model - O modelo contendo as informações de ativa o da conta
   * @returns Um observable com o resultado da operação
   */
  putAtivarEDesativarConta(
    model: ActiveAndDisabledAccountV1Model
  ) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/col/account/active`,
      model,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Realiza uma requisição para buscar a lista de avatares
   * dispon veis para os usuários
   *
   * @returns Um observable com o resultado da operação
   */
  getListaAvatar(): Observable<ResultV1Model> {
    return this.httpClient.get<ResultV1Model>(
      `${EPIGRAFO_API}/v1/avatars`,
      { headers: this.securityUtil.composeHeader() }
    );
  }


  /**
   * Realiza uma requisição para excluir uma conta de usuário e o
   * perfil relacionado.
   * 
   * @param data - O modelo contendo as informações de exclus o da conta e do perfil
   * @returns Um observable com o resultado da operação
   */
  deleteAccountPerfil(data: RemoveAccountAndUserModel) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/remove`,
      data,
      { headers: this.securityUtil.composeHeader() }
    );
  }
}
