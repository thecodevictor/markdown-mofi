import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargemOcupacaoDiarioV1Model } from '../../margem-desconto-padrao/models/margem-ocupacao-diario-v1.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComunicacaoApiMargemOcupacaoDiarioV1Service } from '../services/comunicaco-api-margem-ocupacao-diario-v1.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormMargemDescontoOcupacaoComponent } from '../form-margem-desconto-ocupacao/form-margem-desconto-ocupacao.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-ocupacao-diaria',
  templateUrl: './ocupacao-diaria.component.html',
  styleUrl: './ocupacao-diaria.component.scss'
})
export class OcupacaoDiariaComponent implements OnInit {

  //variavaies de ambiente
  paginaAtual: number = 1;
  msgMargemExcluida!: boolean;
  userlogado?: AccountAccessV1Model | null;
  tabela: string = "";
  modificarMargens: boolean = true;
  margemOcupacaoTabela: MargemOcupacaoDiarioV1Model[] = [];
  margemOcupAll: MargemOcupacaoDiarioV1Model[] = [];
  margemOcupacaoExcluidas: MargemOcupacaoDiarioV1Model[] = [];
  dtHoje = new Date(); // Obtém a data atual

  // Formata a data para o formato "YYYY-MM-DD"
  ano = this.dtHoje.getFullYear();
  // Mês começa de 0, então adiciona 1
  mes = String(this.dtHoje.getMonth() + 1).padStart(2, '0');
  dia = String(this.dtHoje.getDate()).padStart(2, '0');
  dtFormatada = `${this.ano}-${this.mes}-${this.dia}`;


  //variaveis toast
  toaster: any;
  globalConfig: GlobalConfig

  //referenta ao modal
  private modalService = inject(NgbModal);



  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private readonly margemOcupacaoDiarioV1Service: ComunicacaoApiMargemOcupacaoDiarioV1Service,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getMargemOcupacaoDiario();
  }

  //função para popular a variavel com os itens que aparecem no template
  async getMargemOcupacaoDiario() {
    this.margemOcupAll = [];
    this.margemOcupacaoExcluidas = [];

    //starter loader
    this.loaderService.startLoader();

    this.margemOcupacaoDiarioV1Service
      .getAllMargemcupacaoDiario()
      .subscribe((resultado: ResultV1Model) => {
        resultado.data.forEach((element: MargemOcupacaoDiarioV1Model) => {
          new Date(element.data!) < this.dtHoje && !element.excluded
            ? (element.excluded = true)
            : null;
          if (element.excluded) {
            this.margemOcupacaoExcluidas.push(element);
          } else {
            this.margemOcupAll.push(element);
          }
        });
        this.montaTabela("");

        //stop loader
        this.loaderService.stopLoader();
      });
  }

  montaTabela(tipo: string) {
    this.margemOcupacaoTabela = [];
    switch (tipo) {
      case "excluidas":
        this.msgMargemExcluida = false;
        this.modificarMargens = false;
        this.margemOcupacaoTabela = this.margemOcupacaoExcluidas.sort((a, b) =>
          b.data < a.data ? 1 : -1
        );
        this.tabela = "excluidas";
        /** Teste para mostrar a msg se a condicao for verdadeira */
        if (this.margemOcupacaoExcluidas.length == 0) {
          this.msgMargemExcluida = true;
        }
        break;

      default:
        this.msgMargemExcluida = false;
        this.modificarMargens = true;
        this.margemOcupacaoTabela = this.margemOcupAll.sort((a, b) =>
          b.data < a.data ? 1 : -1
        );
        this.tabela = "";
        /** Teste para mostrar a msg se a condicao for verdadeira */
        if (this.margemOcupAll.length == 0) {
          this.msgMargemExcluida = true;
        }
        break;
    }
  }

  openFormNewMargemOcupacao(acao: boolean) {
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
      this.getMargemOcupacaoDiario()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }

  editarMargemOcupacaoDiario(
    margem: MargemOcupacaoDiarioV1Model,
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

    modalRef.componentInstance.margemocupacaoDiario = margem;
    modalRef.componentInstance.Ocupacao = acao;
    modalRef.componentInstance.editar = editar;
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getMargemOcupacaoDiario()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }

  async desabilitaMargem(margem: MargemOcupacaoDiarioV1Model) {
    //starter loader
    this.loaderService.startLoader();

    await this.margemOcupacaoDiarioV1Service
      .putMargemOcupacaoDiario(margem)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          resultado.success ? "success" : "error"
        );
        this.getMargemOcupacaoDiario();
      });

    //stop loader
    this.loaderService.stopLoader();
  }

  // Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastr.success(titulo, message) : null;
    typeToaster == "info" ? this.toastr.info(titulo, message) : null;
    typeToaster == "warning" ? this.toastr.warning(titulo, message) : null;
    typeToaster == "error" ? this.toastr.error(titulo, message) : null;
  }

}
