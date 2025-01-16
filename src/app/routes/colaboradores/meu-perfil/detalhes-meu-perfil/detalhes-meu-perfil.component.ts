import { Component } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { HeaderUserService } from 'src/app/_core/services/headeruser.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-detalhes-meu-perfil',
  templateUrl: './detalhes-meu-perfil.component.html',
  standalone: false
})
export class DetalhesMeuPerfilComponent {

  // Variaveis de ambiente
  userLogado: AccountAccessV1Model | null;
  tipoDeAcesso: 'detalhes' | 'editar' | 'alterarAvatar' = 'detalhes';
  location: any;

  constructor(
    private headerService: HeaderUserService,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.userLogado = SecurityUtil.getAccount();

    //atualiza os dados da conta quando o perfil e atualizado
    this.headerService.eventoAlteraDados.subscribe(
      () => this.getUserLogado()
    );
  }

  getUserLogado() {
    this.userLogado = SecurityUtil.getAccount();
  }

  /**
   * Função chamada após a alteração dos dados do perfil,
   * onde o tipo de acesso volta a ser "detalhes" e
   * exibe uma mensagem Toast com o resultado da alteração.
   * @param resultado Resultado da alteração do perfil
   * @returns void
   */
  voltarAosDetalhes(resultado: ResultV1Model) {
    this.tipoDeAcesso = 'detalhes';

    // Exibe uma mensagem Toast com o resultado da alteração
    this.mensagemToastrService.show(
      resultado.message,
      resultado.titulo,
      resultado.success
        ? 'success' // Se a alteração foi bem sucedida
        : (resultado.titulo?.includes('cancelada')
          ? 'info' // Se a alteração foi cancelada
          : 'error' // Se a alteração teve um erro
        )
    )
  }
}
