// Components do sistema
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
// Utils
import { SecurityUtil } from '../utils/security.util';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private route: Router,
  ) { }

  // verificar quanto tempo tem desde o ultimo refreshtoken
  refreshtoken() {
    // this.loginService.refreshtoken()
    //   .subscribe({
    //     next: (resultado: any) => {
    //       SecurityUtil.setToken(resultado.data.token);
    //       this.updateNotificacoes();
    //     },
    //     error: (err) => {
    //       // SecurityUtil.clear();
    //       this.route.navigate(['/auth/login']);
    //     }
    //   });
  }

  userLogado() {

  }

  updateNotificacoes() {

  }

}
