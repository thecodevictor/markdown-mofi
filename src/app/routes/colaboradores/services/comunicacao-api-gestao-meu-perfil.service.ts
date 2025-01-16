import { Injectable } from "@angular/core";
import { EPIGRAFO_API } from "src/app/_core/api";
import { AvatarV1Model } from "src/app/_core/models/avatar-v1.model";
import { ResultV1Model } from "src/app/_core/models/result-v1.model";
import { HttpComunicacaoService } from "src/app/_core/services/http-comunicacao.service";

@Injectable()
export class ComunicacaoApiGestaoMeuPerfilService extends HttpComunicacaoService {
  putAtualizarSenha(newaccesskey: string) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/auth/updateaccesskey`,
      { newaccesskey },
      { headers: this.securityUtil.composeHeader() }
    );
  }

  putUpdateAvatar(avatar: AvatarV1Model) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/avatar/update`,
      avatar,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  putUploadAvatar(data: FormData) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/avatar/upload`,
      data,
      { headers: this.securityUtil.composeHeader() }
    );
  }

  putUpdateConta(perfil: {
    nome: string,
    telefone: string,
    apelido: string,
  }) {
    return this.httpClient.put<ResultV1Model>(
      `${EPIGRAFO_API}/v1/account/perfil`,
      perfil,
      { headers: this.securityUtil.composeHeader() }
    );
  }
}