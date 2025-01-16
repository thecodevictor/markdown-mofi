import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { CupomV2Model } from '../models/cupom-v2.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { CupomV2Service } from '../services/cupom-v2.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { ActiveCupomV1Model } from '../models/active-cupom-v1-model';
import { RemoveCupomV1Model } from '../models/remove-cupom-v1-model';
import { Subject } from 'rxjs';
import { DetalhesCupomComponent } from '../detalhes-cupom/detalhes-cupom.component';
import { FormCupomComponent } from '../form-cupom/form-cupom.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-cupom-individual',
  templateUrl: './cupom-individual.component.html',
  styleUrl: './cupom-individual.component.scss'
})
export class CupomIndividualComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  //icons 
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff

  /** Variaveis de ambiente */
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  tabela: string = "";
  cuponsUnicoTabela: CupomV2Model[] = [];
  cuponsUnicoAll: CupomV2Model[] = [];
  cuponsUnicoPorcentagem: CupomV2Model[] = [];
  cuponsUnicoValorFixo: CupomV2Model[] = [];
  cuponsUnicoExcluidos: CupomV2Model[] = [];
  cuponsUnicoAtivos: CupomV2Model[] = [];
  cuponsUnicoDesativados: CupomV2Model[] = [];
  titulo: string = "Nenhum cupom localizado";
  tituloFiltro: string = "Todas";
  tipo: string = '';
  msgCupomUnicoExcluido!: boolean;
  testePermissaoDeleteAndRestore!: boolean;

  
  //Referente ao Modal
  private modalService = inject(NgbModal);

  // Variaveis Toast
  toaster?: ToastrService;
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
    //BreadCrumb
    this.breadCrumbItems = [
      { label: "Reservas" },
      { label: "Cupons" },
      { label: "Cupons Individuais", active: true },
    ];
    this.getAllCupons(this.tabela);
  }

  async getAllCupons(tabelaAtual: string) {
    //Starter Loader
    this.loaderService.startLoader();
    this.zerarTabelas()

    
    //Consumindo o serviço de get all cupons e populando as variáveis
    //de cada finalidade.
    this.cupomV2Service.getAllCupons().subscribe(
      (resultado: ResultV1Model) => {
      
      //caso o cupom esteja excluded = true, e estiver com o active true, essa função irá tornar o active false.
      resultado.data.forEach(
        (element: CupomV2Model) => {
          if (element.excluded && element.active) {
            this.ativaDesativaCupom(element);
          }
        }
      )

      let cupons: CupomV2Model[] = resultado.data;
      
      resultado.success
        ? (
          this.titulo = "Cupom(ns) encontrado(s)",
          cupons.forEach((element) => {
            if (!element.promocional && !element.isTemporada) {
              if (!element.excluded) {
                this.cuponsUnicoAll?.push(element);
              }
              if (element.excluded) {
                this.cuponsUnicoExcluidos.push(element);
              } else if (element.tpcupom) {
                this.cuponsUnicoPorcentagem?.push(element);
              } else {
                this.cuponsUnicoValorFixo?.push(element);
              }
              if (element.active) {
                this.cuponsUnicoAtivos.push(element);
              } else {
                this.cuponsUnicoDesativados.push(element);
              }
            }
          }))
        : (console.log(resultado.error));
      // chamando a função após o looping.
      this.montaTabela(tabelaAtual);
      
      //Stop Loader
      this.loaderService.stopLoader();
    });
  }

  
  //Função responsável por ativar o cupom, passando o valor
  //passando o valor do atributo active para "false"
  async ativaDesativaCupom(cupom: CupomV2Model) {
    let ativaDesativaCupom: ActiveCupomV1Model = {
      _id: cupom._id,
      active: !cupom.active
    }

    this.cupomV2Service
      .activedAndDesactivedCupomUnico(ativaDesativaCupom)
      .subscribe(
        (resultado: ResultV1Model) => {
        if(resultado.titulo === 'Cupom ativado'){
          this.mensagemToastrService.show(resultado.titulo, resultado.message, "success")
        }else{
          this.mensagemToastrService.show(resultado.titulo, resultado.message, "warning")
        }
        this.getAllCupons(this.tabela);
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

    this.cupomV2Service
      .removeRestauraCupom(removeOrRestaurarCupom)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          !cupom.excluded ? "error" : "success"
        );
        this.getAllCupons(this.tabela);
      });
  }

  
  //Função responsável por mandar os parametros necessários para o
  //FormCupomComponent editar cupom.
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
      this.getAllCupons(this.tabela)
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })

  }

  
  //Função para mostrar detalhes do cupom, eviando os dados para o component "DetalhesCupomComponent"
  //mostrar no modal.
  openDetalhesCupom(acao: boolean, cupom?: CupomV2Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      DetalhesCupomComponent,
      configModal
    );
    modalRef.componentInstance.detalhesCupom = cupom ? cupom : null;
    modalRef.componentInstance.modalDetalhes = acao
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      // Aqui você recebe o valor retornado pelo modal
      this.getAllCupons(this.tabela)
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error');
      //Stop Loader
      this.loaderService.stopLoader();
    });

  }


  
  //Função responsável por popular a variável 'cuponsPromocionalTabela'
  //com base no filtro selecionado.
  montaTabela(tipo: string) {
    this.cuponsUnicoTabela = [];
    switch (tipo) {
      case "%":
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoPorcentagem;
        this.tabela = "%";
        this.tipo = "tipo porcentagem";
        if (this.cuponsUnicoPorcentagem!.length == 0) {
          this.msgCupomUnicoExcluido = true;}
        break;

      case "$":
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoValorFixo;
        this.tabela = "$";
        this.tipo = "tipo valor";
        if (this.cuponsUnicoValorFixo!.length == 0) {
          this.msgCupomUnicoExcluido = true;
        }
        break;

      case "exc":
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoExcluidos;
        this.tabela = "exc";
        this.tipo = "excluído";
        if (this.cuponsUnicoExcluidos!.length == 0) {
          this.msgCupomUnicoExcluido = true;
        }
        break;

      case "on":
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoAtivos;
        this.tabela = "on";
        this.tipo = "ativo";
        if (this.cuponsUnicoAtivos.length == 0) {
          this.msgCupomUnicoExcluido = true;
        }
       break;

      case "off":
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoDesativados;
        this.tabela = "off";
        this.tipo = "desativado";
        if (this.cuponsUnicoDesativados.length == 0) {
          this.msgCupomUnicoExcluido = true;
        }
        break;

      default:
        this.msgCupomUnicoExcluido = false;
        this.testePermissaoDeleteAndRestore = true;
        this.cuponsUnicoTabela = this.cuponsUnicoAll;
        this.tabela = "";
        this.tipo = "válido";
        if (this.cuponsUnicoAll!.length == 0) {
          this.msgCupomUnicoExcluido = true;
        }
        break;
    }
  }
  
  zerarTabelas(){
    this.cuponsUnicoAll = [], 
    this.cuponsUnicoPorcentagem = [], 
    this.cuponsUnicoValorFixo = [],
    this.cuponsUnicoExcluidos = [], 
    this.cuponsUnicoAtivos = [], 
    this.cuponsUnicoDesativados = []
  }

  
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
