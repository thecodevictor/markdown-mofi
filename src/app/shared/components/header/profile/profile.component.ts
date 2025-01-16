import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AccountAccessV1Model } from "src/app/_core/models/account-access-v1.model";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { MENUHOME } from "src/app/routes/home/home.menu";
import { ComunicandoEntreComponentesLoginService } from "src/app/shared/services/comunicando-entre-componentes.service";
import { NavService } from "src/app/shared/services/nav.service";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.component.html"
})

export class ProfileComponent {
  /** Variaveis de ambiente */
  userLogado!: AccountAccessV1Model | null;

  public isShow: boolean = false;

  constructor(
    public router: Router,
    private comunicacaoEntreComponentes: ComunicandoEntreComponentesLoginService,
    private navService: NavService
  ) {
    this.comunicacaoEntreComponentes.atualizaAvatarImage.subscribe(
      () => this.userLogado = SecurityUtil.getAccount()
    )
    /**
     * Coleta dados do usuário authenticado
     */
    this.userLogado = SecurityUtil.getAccount();
  }

  /**
   * Logout the user
   */
  logout() {
    SecurityUtil.clear();
    this.router.navigate([`/auth/login`]);
    this.navService.items.next(MENUHOME);
  }

}
