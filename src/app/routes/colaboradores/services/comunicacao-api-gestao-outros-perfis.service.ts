import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { AvatarV1Model } from "src/app/_core/models/avatar-v1.model";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { HttpComunicacaoService } from "src/app/_core/services/http-comunicacao.service";
import { UpdateAccountColaboradorV1Model } from "../models/update-account-colaborador-v1.model";
import { Observable } from "rxjs";

@Injectable()
export class ComunicacaoApiGestaoOutrosPerfisService extends HttpComunicacaoService {
  /**
   * Atualiza o avatar de um perfil de outro colaborador.
   * @param _id ID do perfil do outro colaborador.
   * @param avatar Avatar a ser atualizado.
   * @returns Retorna um `Observable` com o resultado da operao.
   */
  putAtualizarAvatarOutrosPerfis(
    _id: string,
    avatar: AvatarV1Model
  ) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/outros-avatars/${_id}/update`,
      avatar,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Faz o upload de um avatar para o perfil de outro colaborador.
   * @param _id O ID do perfil do outro colaborador.
   * @param data O avatar a ser feito upload em forma de um objeto FormData.
   * @returns Um ResultV1Model contendo o resultado da opera o.
   */
  putUploadAvatarOutrosPerfis(_id: string, data: FormData): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/outros-avatars/${_id}/upload`,
      data,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Atualiza a chave de acesso de outro perfil de colaborador.
   * @param updateAccessKey Um objeto contendo o ID do perfil do outro colaborador
   * e a nova chave de acesso.
   * @returns Retorna um `Observable` com o resultado da opera o.
   */
  putAtualizarSenhaOutrosPerfis(updateAccessKey: {
    _id: string,
    newaccesskey: string
  }): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/auth/updateoutraaccesskey`,
      updateAccessKey,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  /**
   * Atualiza os dados de outro perfil de colaborador.
   * @param perfil Um objeto contendo os dados do outro perfil de colaborador.
   * @returns Retorna um `Observable` com o resultado da opera o.
   */
  putUpdateAtualizarContaOutrosPerfis(
    perfil: UpdateAccountColaboradorV1Model
  ): Observable<ResultV1Model> {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/outro-perfil`,
      perfil,
      { headers: this.securityUtil.composeHeader() }
    );
  }
}