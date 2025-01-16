import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargemOcupacaoPadraoV1Model } from '../models/margem-ocupacao-padrao-v1.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { ComunicacaoApiMargemOcupacaoPadraoV1Service } from '../services/comunicacao-api-margem-ocupacao-padrao-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormMargemComponent } from '../form-margem/form-margem.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-ocupacao-padrao',
  templateUrl: './ocupacao-padrao.component.html',
  styleUrl: './ocupacao-padrao.component.scss'
})
export class OcupacaoPadraoComponent implements OnInit{

  //varivaveis de abiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  margem: MargemOcupacaoPadraoV1Model[] = [];
  margemFiltrada: MargemOcupacaoPadraoV1Model[] = [];
  msgMargemExcluida: boolean = false;

  //referente ao modal
  private modalService = inject(NgbModal)

  // Variaveis Toast
  toaster: any;
  globalConfig: GlobalConfig;


  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private readonly margemOcupacaoPadraoV1Service: ComunicacaoApiMargemOcupacaoPadraoV1Service,
    private loaderService: LoaderService,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getMargemDesconto();
  }

  //função para popular a variavel
  async getMargemDesconto() {
    this.margem = [];
    this.margemFiltrada = [];

    //starter loader
    this.loaderService.startLoader();

    await this.margemOcupacaoPadraoV1Service.getAllMargensOcupacaoPadrao()
      .subscribe(
        (resultado: ResultV1Model) => {
          resultado.data.forEach((element: MargemOcupacaoPadraoV1Model) => {
            if (element.status) {
              this.margem.unshift(element)
            } else
              this.margem.push(element)
          });
          //Ordenando a variável por data 
          this.margemFiltrada = this.margem.sort(
            (a, b) => (b.dtEncerramento < a.dtEncerramento) ? -1 : 1
          );
          // Teste para mostrar a msg se a condicao for verdadeira 
          if (this.margemFiltrada.length == 0) {
            this.msgMargemExcluida = true;
          }
         
          //Starter Loader
          this.loaderService.stopLoader();
        }
      )
  }

  //abrindo modal para criar nova margem
  openFormNewMargem(acao: boolean) {
  let configModal = {
    keyboard: false,
    centered: true,
    size: 'sm',
    modalDialogClass: "modal-dialog modal-dialog-centered modal-md"
  }
  let modalRef: NgbModalRef = this.modalService.open(
    FormMargemComponent,
    configModal
  );
  modalRef.componentInstance.OcupacaoOrDesconto = acao;
  //stop loader
  this.loaderService.stopLoader()
}

  

}
