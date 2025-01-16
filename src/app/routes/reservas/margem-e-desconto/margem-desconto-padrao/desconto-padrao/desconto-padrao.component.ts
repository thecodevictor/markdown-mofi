import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargemDescontoPadraoV1Model } from '../models/margem-desconto-padrao-v1.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { ComunicacaoApiMargemDescontoPadraoV1Service } from '../services/comunicacao-api-margem-desconto-padrao-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { elementAt } from 'rxjs';
import { FormMargemComponent } from '../form-margem/form-margem.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-desconto-padrao',
  templateUrl: './desconto-padrao.component.html',
  styleUrl: './desconto-padrao.component.scss'
})
export class DescontoPadraoComponent implements OnInit {

  //varivaeis de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  margem: MargemDescontoPadraoV1Model[] = [];
  margemFiltrada: MargemDescontoPadraoV1Model[] = [];
  margemExcluida: MargemDescontoPadraoV1Model[] = [];
  isMargem!: boolean;
  titulo: string = 'Margem(ns) encontrada(s)';
  tituloFiltro: string = 'Todas';
  msgMargemExcluida: boolean = false;

  //referente ao modal
  private modalService = inject(NgbModal);

  // Variaveis Toast
  toaster: any;
  globalConfig: GlobalConfig;

  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private readonly margemDescontoPadraoV1Service: ComunicacaoApiMargemDescontoPadraoV1Service,
    private loaderService: LoaderService,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getMargemDesconto();
  }

  //função para popuçar aa variaveis
  async getMargemDesconto() {
    this.margem = [];

    //starter loader
    this.loaderService.startLoader()

    await this.margemDescontoPadraoV1Service.getAllMargensDescontoPadrao()
      .subscribe(
        (resultado: ResultV1Model) => {
          resultado.data.forEach((element: MargemDescontoPadraoV1Model) => {
            if (element.status) {
              this.margem.unshift(element)
            } else
              this.margem.push(element)
          })

          //populado a variavel, ordenando por data
          this.margemFiltrada = this.margem.sort(
            (a, b) => (b.dtEncerramento < a.dtEncerramento) ? -1 : 1
          );
          //teste para mostrar a msg se a condição for verdadeira
          if (this.margemFiltrada.length == 0) {
            this.msgMargemExcluida = true
          }

          //stop Loeader
          this.loaderService.stopLoader()
        }
      )

  }

  //abrindo o modal para criar nova margem
  openFormNewMargem(acao: boolean) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'sm',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormMargemComponent,
      configModal
    );

    modalRef.componentInstance.OcupacaoOrDesconto = acao;
    //stop loader
    this.loaderService.stopLoader();
  }
   
   
    // this.modalParams = Object.assign({}, this.config, { initialState });
    // this.modbalRef = this.modalService.show(FormMargemComponent, this.modalParams);
    // this.modalRef.content.onClose = new Subject<any>();
    // this.modalRef.content.onClose.subscribe((resultado: any) => {
    //   this.getMargemDesconto();
    //   this.toast(resultado.title, resultado.message, resultado.typeToaster);
      
    //   //stop loader
    //   this.loaderService.stopLoader();
    // });
  

  // Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == 'success' ? this.toastr.success(titulo, message) : null;
    typeToaster == 'info' ? this.toastr.info(titulo, message) : null;
    typeToaster == 'warning' ? this.toastr.warning(titulo, message) : null;
    typeToaster == 'error' ? this.toastr.error(titulo, message) : null;
  };

}

