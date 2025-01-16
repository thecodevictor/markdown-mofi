import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargemDescontoDiarioV1Model } from '../models/margem-desconto-diario-v1.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { ComunicacaoApiMargemDescontoDiarioV1Service } from '../services/comunicacao-api-margem-desconto-diario-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { elementAt } from 'rxjs';
import { FormMargemDescontoOcupacaoComponent } from '../form-margem-desconto-ocupacao/form-margem-desconto-ocupacao.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-desconto-diario',
  templateUrl: './desconto-diario.component.html',
  styleUrl: './desconto-diario.component.scss'
})
export class DescontoDiarioComponent implements OnInit {

  //variavais de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  modificarMargens: boolean = true;
  msgMargemExcluida!: boolean;
  tabela: string = "";
  margemDescTabela: MargemDescontoDiarioV1Model[] = [];
  margemDescAll: MargemDescontoDiarioV1Model[] = [];
  margemDescontoExcluidas: MargemDescontoDiarioV1Model[] = [];
  dtHoje = new Date(new Date().setUTCHours(0, 0, 0, 0));

  //referent modal
  private modalService = inject(NgbModal);

  //variaveis toast
  toaster: any;
  globalConfig: GlobalConfig

  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private readonly margemDescontoDiarioV1Service: ComunicacaoApiMargemDescontoDiarioV1Service,
    private loaderService: LoaderService,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getMargemDescDiario();
  }

  //função para popular a cariavel com os itens que aparecem no template
  async getMargemDescDiario() {
    this.margemDescAll = [];
    this.margemDescontoExcluidas = [];

    //starter loader
    this.loaderService.startLoader();

    this.margemDescontoDiarioV1Service
      .getAllMargemDescDiario()
      .subscribe((resultado: ResultV1Model) => {
        resultado.data.forEach(
          (element: MargemDescontoDiarioV1Model) => {
            new Date(element.data!) < this.dtHoje && !element.excluded
              ? (element.excluded = true)
              : null;
            if (element.excluded) {
              this.margemDescontoExcluidas.push(element);
            } else {
              this.margemDescAll.push(element);
            }
          });
        this.montaTabela("");

        //stop loader
        this.loaderService.stopLoader();
      });
  }

  montaTabela(tipo: string) {
    this.margemDescTabela = [];
    switch (tipo) {
      case "excluidas":
        this.modificarMargens = false;
        this.margemDescTabela = this.margemDescontoExcluidas.sort((a, b) =>
          b.data < a.data ? 1 : -1
        );
        this.tabela = "excluidas";
        /** Teste para mostrar a msg se a condicao for verdadeira */
        if (this.margemDescontoExcluidas.length == 0) {
          this.msgMargemExcluida = true;
        }
        break;

      default:
        this.modificarMargens = true;
        this.margemDescTabela = this.margemDescAll.sort((a, b) =>
          b.data < a.data ? 1 : -1
        );
        this.tabela = "";
        /** Teste para mostrar a msg se a condicao for verdadeira */
        if (this.margemDescAll.length == 0) {
          this.msgMargemExcluida = true;
        }
        break;
    }
  }

  //Abrindo o modal para criar nova margem
  openFormNewMargem(acao: boolean) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'sm',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormMargemDescontoOcupacaoComponent,
      configModal
    );
    modalRef.componentInstance.Ocupacao = acao
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getMargemDescDiario()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }


  //Abrindo o modal para editar nova margem
  editarMargemDescDiario(
    margem: MargemDescontoDiarioV1Model,
    acao: boolean,
    editar: boolean
  ) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'sm',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormMargemDescontoOcupacaoComponent,
      configModal
    );

    modalRef.componentInstance.margemDescontoDiario = margem;
    modalRef.componentInstance.Ocupacao = acao;
    modalRef.componentInstance.editar = editar;
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getMargemDescDiario()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }

  async desabilitaMargem(margem: MargemDescontoDiarioV1Model) {
    /**
     * Inicia o Loader
     */
    this.loaderService.startLoader();

    await this.margemDescontoDiarioV1Service
      .putMargemDescDiario(margem)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          resultado.success ? "success" : "error"
        );
        this.getMargemDescDiario();
      });
    /**
     * Para o Loader
     */
    this.loaderService.stopLoader();
  }

  //Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastr.success(titulo, message) : null;
    typeToaster == "info" ? this.toastr.info(titulo, message) : null;
    typeToaster == "warning" ? this.toastr.warning(titulo, message) : null;
    typeToaster == "error" ? this.toastr.error(titulo, message) : null;
  }


}
