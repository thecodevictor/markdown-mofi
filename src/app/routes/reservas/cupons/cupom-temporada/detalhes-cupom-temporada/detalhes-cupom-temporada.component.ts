import { Component, OnInit, inject } from '@angular/core';
import { CupomV2Model } from '../../models/cupom-v2.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-detalhes-cupom-temporada',
  templateUrl: './detalhes-cupom-temporada.component.html',
  styleUrl: './detalhes-cupom-temporada.component.scss'
})
export class DetalhesCupomTemporadaComponent implements OnInit {

  cupom!: CupomV2Model

  globalConfig: GlobalConfig

  //Referente ao Modal
  private modalService = inject(NgbModal);

  constructor(
    public formatarValoresService: FormatarValoresService,
    public toastrService: ToastrService,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.globalConfig = this.toastrService.toastrConfig;
  }

  ngOnInit(): void {
    console.log(this.cupom)
  }

  fechar(){
    this.modalService.dismissAll();
  }
  

  copiarCodigoParaClipboard() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = `${this.cupom.codecupom}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.mensagemToastrService.show(
      "URL da Promoção",
      "URL copiada para a área de transferência",
      "success"
    );
  }

  mostrarMensagem(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.closeButton = true;
    this.globalConfig.easing = 'ease-in';;
    this.globalConfig.positionClass = "toast-botton-center";
    typeToaster == "success"
      ? this.toastrService.success(titulo, message)
      : null;
    typeToaster == "info"
      ? this.toastrService.info(titulo, message)
      : null
    typeToaster == "warning"
      ? this.toastrService.warning(titulo, message)
      : null
    typeToaster == "error"
      ? this.toastrService.error(titulo, message)
      : null
  }

}
