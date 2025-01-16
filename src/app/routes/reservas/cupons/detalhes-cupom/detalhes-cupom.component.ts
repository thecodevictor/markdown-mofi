import { Component, OnInit, inject } from '@angular/core';
import { CupomV1Model } from '../models/cupom-v1.model';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-detalhes-cupom',
  templateUrl: './detalhes-cupom.component.html',
  styleUrl: './detalhes-cupom.component.scss'
})
export class DetalhesCupomComponent implements OnInit {

  /**
   * variáveis de ambiente
   */
  detalhesCupom!: CupomV1Model;
  userLogado?: AccountAccessV1Model | null;
  nomeCupom?: string;
  tipoCupomPorcentagem?: any;
  tipoCupomValor?: any;
  dataInicio?: any;
  dataFim?: any;
  porcentagem: boolean = true;
  globalConfig: GlobalConfig;

  private modalService = inject(NgbModal)

  constructor(
    private toastrService: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    public formatarValoresService: FormatarValoresService
  ) {
    this.userLogado = SecurityUtil.getAccount();
    this.globalConfig = this.toastrService.toastrConfig;
  }


  ngOnInit(): void {
    this.preencheDetalhesCupon(this.detalhesCupom);
    this.userLogado = SecurityUtil.getAccount();
    console.log('this.detalhesCupom')
    console.log(this.detalhesCupom)
  }

  /**
   * Função que popula as variáveis para o template.
   */
  async preencheDetalhesCupon(detalhes?: CupomV1Model) {
    this.nomeCupom = detalhes?.codecupom;
    this.tipoCupomPorcentagem = (`${detalhes?.porcent}%`);
    //this.tipoCupomValor = (`R$ ${detalhes?.valor}`);
    this.tipoCupomValor = (this.formatarValoresService.formatar(detalhes?.valor));
    this.dataInicio = new Date(detalhes?.dtinicio!).toLocaleDateString();
    this.dataFim = new Date(detalhes?.dtfim!).toLocaleDateString();

    console.log(detalhes)
  }

  /**
   * Fecha o modal de Detalhes
   */
  cancela(): void {
    this.modalService.dismissAll();
  }

  copiarCodigoParaClipboard() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = `${this.nomeCupom}`;
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
    this.globalConfig.easing = 'ease-in';
    this.globalConfig.positionClass = "toast-bottom-center";
    typeToaster == "success"
      ? this.mensagemToastrService.show(titulo, message, 'success')
      : null;
    typeToaster == "info" ? this.toastrService.info(titulo, message) : null;
    typeToaster == "warning"
      ? this.mensagemToastrService.show(titulo, message, 'warning')
      : null;
    typeToaster == "error" ? this.mensagemToastrService.show(titulo, message, 'error') : null;
  }
}