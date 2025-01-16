import { Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MensagemToastrService {

  constructor(
    private toastrService: ToastrService
  ) { }

  /**Função utilizada para mostrar o toastr em tela
   * @param message corpo do toastr, onde é informado a mensagem,
   * @param titulo titulo do toastr,
   * @param typeToaster o tipo do toastr para personalização da cor do background, podendo ser 'success', 'info', 'warning', 'error'
   */
  show(message: string, titulo: string, typeToaster: string){
    let globalConfig: GlobalConfig = this.toastrService.toastrConfig;

    globalConfig!.progressBar = true;
    globalConfig!.titleClass = "text-light";
    globalConfig!.messageClass = "text-light";
    globalConfig!.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastrService!.success(message, titulo) : null;
    typeToaster == "info" ? this.toastrService!.info(message, titulo) : null;
    typeToaster == "warning" ? this.toastrService!.warning(message, titulo) : null;
    typeToaster == "error" ? this.toastrService!.error(message, titulo) : null;
  }
}
