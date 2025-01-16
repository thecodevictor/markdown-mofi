import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { CupomV2Model } from '../models/cupom-v2.model';
import { NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { CupomV2Service } from '../services/cupom-v2.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { ActiveCupomV1Model } from '../models/active-cupom-v1-model';
import { RemoveCupomV1Model } from '../models/remove-cupom-v1-model';
import { FormCupomComponent } from '../form-cupom/form-cupom.component';
import { DetalhesCupomComponent } from '../detalhes-cupom/detalhes-cupom.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-cupom-promocional',
  templateUrl: './cupom-promocional.component.html',
  styleUrl: './cupom-promocional.component.scss'
})
export class CupomPromocionalComponent implements OnInit {

  //icons 
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff

  //variaveis de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  tabela: string = "";
  cuponsPromocionalTabela: CupomV2Model[] = [];
  cuponsPromocionalAll: CupomV2Model[] = [];
  cuponsPromocionalPorcentagem: CupomV2Model[] = [];
  cuponsPromocionalValorFixo: CupomV2Model[] = [];
  cuponsPromocionalExcluidos: CupomV2Model[] = [];
  cuponsPromocionalAtivos: CupomV2Model[] = [];
  cuponsPromocionalDesativados: CupomV2Model[] = [];
  titulo: string = "Nenhum cupom foi localizado";
  tipo: string = "";
  tituloFiltro: string = "todas";
  msgCupomPromocionalExcluido!: boolean;
  permissaoDeleteAndRestore!: boolean;
  dataAtual: Date = new Date();

  //referente ao modal
  private modalService = inject(NgbModal);

  //variaveis toast
  toaster: any;
  globalConfig: GlobalConfig;

  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private readonly cupomV2Service: CupomV2Service
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getAllCupons();
  }

  async getAllCupons() {

    //Starter Loader
    this.loaderService.startLoader();

    //Variáveis a serem preenchidas no looping de Retorno do serviço.


    //Consumindo o serviço de get all cupons e populando as variáveis
    //de cada finalidade.
    await this.cupomV2Service
      .getAllCupons()
      .subscribe((resultado: ResultV1Model) => {

        //caso o cupom esteja excluded = true, e estiver com o active true, 
        //essa função irá tornar o active false.
        resultado.data.forEach((element: CupomV2Model) => {
          if (element.excluded && element.active) {
            this.ativaDesativaCupom(element);
          }
        });

        let cupons: CupomV2Model[] = resultado.data;
        resultado.success
          ? (
            (this.cuponsPromocionalAll = []),
            (this.cuponsPromocionalPorcentagem = []),
            (this.cuponsPromocionalValorFixo = []),
            (this.cuponsPromocionalExcluidos = []),
            (this.cuponsPromocionalAtivos = []),
            (this.cuponsPromocionalDesativados = []),
            (this.titulo = "Cupom(ns) encontrado(s)"),
            cupons.forEach(
              (element) => {
                if (element.promocional == true) {
                  if (!element.excluded) {
                    this.cuponsPromocionalAll.push(element);
                  }
                  if (element.excluded) {
                    this.cuponsPromocionalExcluidos.push(element);
                  } else if (element.tpcupom) {
                    this.cuponsPromocionalPorcentagem.push(element);
                  } else {
                    this.cuponsPromocionalValorFixo.push(element);
                  }
                  if (element.active) {
                    this.cuponsPromocionalAtivos.push(element);
                  } else {
                    this.cuponsPromocionalDesativados.push(element);
                  }
                }
              },
            )
          )
          : console.log(resultado.error);
        //chamando a função após o looping.
        this.montaTabela(this.tabela);

        //Stop Loader
        this.loaderService.stopLoader();
      });
  }

  openDropDownMenu(dropdownMenu: NgbDropdown) {
    dropdownMenu.open();
  }
  closeDropDownMenu(dropdownMenu: NgbDropdown) {
    dropdownMenu.close();
  }


  //Função responsável por popular a variável 'cuponsPromocionalTabela'
  //com base no filtro selecionado.
  montaTabela(tipo: string) {
    this.cuponsPromocionalTabela = [];
    switch (tipo) {
      case "%":
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalPorcentagem;
        this.tabela = "%";
        this.tipo = "tipo porcentagem";
        if (this.cuponsPromocionalPorcentagem!.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
      case "$":
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalValorFixo;
        this.tabela = "$";
        this.tipo = "tipo valor";
        if (this.cuponsPromocionalValorFixo!.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
      case "exc":
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalExcluidos;
        this.tabela = "exc";
        this.tipo = "excluído";
        if (this.cuponsPromocionalExcluidos!.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
      case "on":
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalAtivos;
        this.tabela = "on";
        this.tipo = "ativado";
        if (this.cuponsPromocionalAtivos.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
      case "off":
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalDesativados;
        this.tabela = "off";
        this.tipo = "desativado";
        if (this.cuponsPromocionalDesativados.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
      default:
        this.msgCupomPromocionalExcluido = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsPromocionalTabela = this.cuponsPromocionalAll;
        this.tabela = "";
        this.tipo = "válido";
        if (this.cuponsPromocionalAll!.length == 0) {
          this.msgCupomPromocionalExcluido = true;
        } else this.permissaoDeleteAndRestore = false;
        break;
    }
  }


  //Função responsável por ativar o cupom, passando o valor
  //passando o valor do atributo active para "true"
  async ativarCupom(cupom: CupomV2Model) {
    let ativarCupom = new ActiveCupomV1Model(cupom._id, true);
    await this.cupomV2Service
      .activedAndDesactivedCupomUnico(ativarCupom)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(resultado.titulo, resultado.message, "success");
        this.getAllCupons();
      });
  }


  //Função responsável por ativar o cupom, passando o valor
  //passando o valor do atributo active para "false"
  async ativaDesativaCupom(cupom: CupomV2Model) {
    let ativaDesativaCupom: ActiveCupomV1Model = {
      _id: cupom._id,
      active: !cupom.active,
    };

    this.cupomV2Service
      .activedAndDesactivedCupomUnico(ativaDesativaCupom)
      .subscribe((resultado: ResultV1Model) => {
        if (resultado.titulo === "Cupom ativado") {
          this.mensagemToastrService.show(resultado.titulo, resultado.message, "success");
        } else {
          this.mensagemToastrService.show(resultado.titulo, resultado.message, "warning");
        }
        this.getAllCupons();
      });
  }


  //Função responsável por restaurar o cupom, passando o valor
  //do atributo excluded para "false" ou remover, passando o
  //valor do atributo excluded para "true"
  async removeRestauraCupom(cupom: CupomV2Model) {
    let removeOrRestaurarCupom = new RemoveCupomV1Model(
      cupom._id,
      !cupom.excluded
    );

    await this.cupomV2Service
      .removeRestauraCupom(removeOrRestaurarCupom)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          !cupom.excluded ? "error" : "success"
        );
        this.getAllCupons();
      });
  }

  // Função para abrir o modal de "Editar do cupom"
  openFormCupom(acao: boolean, unico: boolean, cupom?: CupomV2Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormCupomComponent,
      configModal
    );

    modalRef.componentInstance.newOrUpdate = acao;
    modalRef.componentInstance.unico = unico;
    modalRef.componentInstance.cuponUpdate = cupom ? cupom : null ;
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getAllCupons()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }

  //Função para mostrar detalhes do cupom, eviando os dados para o component "DetalhesCupomComponent"
  //mostrar no modal.

  // Função para abrir o modal de "Detalhes do cupom"
  openDetalhesCupom(cupom?: CupomV2Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      DetalhesCupomComponent,
      configModal
    )
    modalRef.componentInstance.detalhesCupom = cupom
    modalRef.componentInstance.onClose = new Subject<any>();
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getAllCupons()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })

  };


  //Função responsável por formatar o campo de Porcentagem ou valor de moeda.
  //com base na condição.
  visuTipoCupom(data: CupomV2Model) {
    return data.tpcupom
      ? `${data.porcent.toLocaleString("pt-br")}%`
      : `${data.valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })}`;
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

