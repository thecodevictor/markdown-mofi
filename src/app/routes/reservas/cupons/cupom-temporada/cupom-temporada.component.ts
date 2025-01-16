import { Component, OnInit, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { CupomV2Model } from '../models/cupom-v2.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { CupomV2Service } from '../services/cupom-v2.service';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { ActiveCupomV1Model } from '../models/active-cupom-v1-model';
import { RemoveCupomV1Model } from '../models/remove-cupom-v1-model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FormNovoCupomTemporadaComponent } from './form-novo-cupom-temporada/form-novo-cupom-temporada.component';
import { DetalhesCupomTemporadaComponent } from './detalhes-cupom-temporada/detalhes-cupom-temporada.component';
import { FormCupomComponent } from '../form-cupom/form-cupom.component';
import { Subject } from 'rxjs';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-cupom-temporada',
  templateUrl: './cupom-temporada.component.html',
  styleUrl: './cupom-temporada.component.scss'
})
export class CupomTemporadaComponent implements OnInit{

  //icons 
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff

  //variaveis de ambiente 
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  tabela: string = "";
  cuponsTemporadaASerVisualizado: CupomV2Model[] = [];
  cuponsTemporadaAll: CupomV2Model[] = [];
  cuponsTemporadaValidos: CupomV2Model[] = [];
  cuponsTemporadaPorcentagem: CupomV2Model[] = [];
  cuponsTemporadaValorFixo: CupomV2Model[] = [];
  cuponsTemporadaExcluidos: CupomV2Model[] = [];
  cuponsTemporadaAtivos: CupomV2Model[] = [];
  cuponsTemporadaDesativados: CupomV2Model[] = [];
  titulo: string = "Nenhum cupom foi localizado";
  tipo: string  = ""
  nenhumCupomLocalizado: boolean = true;
  permissaoDeleteAndRestore!: boolean;
  dataAtual: Date = new Date();

  //Referente ao Modal
  private modalService = inject(NgbModal);
  

  //variaveis toast
  globalConfig: GlobalConfig;

  constructor(
    private toastr: ToastrService,
    private mensagemToastrService:MensagemToastrService,
    private loaderService: LoaderService,
    private readonly cupomV2Service: CupomV2Service,
    public formatarValoresService: FormatarValoresService
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getCuponsTemporada();
  }

  async getCuponsTemporada() {
    //zerando todas as tabelas
    this.cuponsTemporadaAll = [];
    this.cuponsTemporadaValidos = [];
    this.cuponsTemporadaPorcentagem = [];
    this.cuponsTemporadaValorFixo = [];
    this.cuponsTemporadaAtivos = [];
    this.cuponsTemporadaDesativados = [];
    this.cuponsTemporadaExcluidos = [];

    //starter loader
    this.loaderService.startLoader()

    //consumindo o serviço getallcupons
    await this.cupomV2Service
      .getAllCupons()
      .subscribe((resultado: ResultV1Model) => {
        if (resultado.success) {
          resultado.data.forEach((element: CupomV2Model, index: number) => {
            //Se for um cupom temporada, é executado os processos //
            if (element.isTemporada) {
              //Variável recebendo todos os cupons temporada
              this.cuponsTemporadaAll.push(element);

              //Alimentando a tabela de cupons por porcentagem e por valor fixo 
              if (element.tpcupom) {
                this.cuponsTemporadaPorcentagem.push(element);
              } else {
                this.cuponsTemporadaValorFixo.push(element);
              }

              //Alimentando a tabela de cupons ativos e desativados 
              if (element.active) {
                this.cuponsTemporadaAtivos.push(element);
              } else {
                this.cuponsTemporadaDesativados.push(element);
              }

              //Alimentando a tabela de cupons excluídos e vigentes
              if (element.excluded) {
                this.cuponsTemporadaExcluidos.push(element);
              } else {
                this.cuponsTemporadaValidos.push(element);
              }

              //Desativando Cupom se o mesmo estiver excluído
              if(element.excluded && element.active){
                this.ativarOuDesativarCupom(element)
              }
            }
          });

          //Após definidas as tabelas, é montado a tabela que irá ser visualizada
          this.montaTabela(this.tipo);

          //Alterando o titulo que fica no top left, caso sejam localizados cupons
          this.nenhumCupomLocalizado ? '' : this.titulo = 'Cupons Temporada'
        }
        this.loaderService.stopLoader();
      });
  }

  
  //Função responsável por ativar o cupom, passando o valor
  //passando o valor do atributo active para "false"
  async ativarOuDesativarCupom(cupom: CupomV2Model) {
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
        this.getCuponsTemporada();
      });
  }

  
  //Função responsável por restaurar o cupom, passando o valor
  //do atributo excluded para "false" ou remover, passando o
  //valor do atributo excluded para "true"
  async removerOuRestaurarCupom(cupom: CupomV2Model) {
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
        this.getCuponsTemporada();
      });
  }

  abrirModalFormNovoCupom() {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormNovoCupomTemporadaComponent,
      configModal
    );
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getCuponsTemporada()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })

  }
  
  

  abrirModalFormEditarCupom(cupom: CupomV2Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormNovoCupomTemporadaComponent,
      configModal
    );
    modalRef.componentInstance.isNovoOuEditando = false
    modalRef.componentInstance.cupom = cupom ? cupom : null ;
    modalRef.componentInstance.resultado.subscribe((resultado: ResultV1Model) => {
      this.getCuponsTemporada()
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error')
      //Stop Loader
      this.loaderService.stopLoader();
    })
  }

  abrirDetalhesCupom(cupom: CupomV2Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      DetalhesCupomTemporadaComponent,
      configModal
    );
    modalRef.componentInstance.cupom = cupom ? cupom : null ;
    
  }

  visualizarTpDesconto(cupom: CupomV2Model) {
    if (cupom.tpcupom) {
      return `${cupom.porcent}%`;
    } else {
      return this.formatarValoresService.formatar(cupom.valor);
    }
  }

  montaTabela(tipo: string) {
    switch (tipo) {
      case "%":
        this.nenhumCupomLocalizado = false;
        this.permissaoDeleteAndRestore = true;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaPorcentagem;
        this.tabela = "%";
        this.tipo = "tipo porcentagem";
        break;
      case "valor":
        this.nenhumCupomLocalizado = false;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaValorFixo;
        this.tabela = "$";
        this.tipo = "tipo valor";
        if (this.cuponsTemporadaValorFixo!.length == 0) {
          this.nenhumCupomLocalizado = true;
        }
        break;
      case "excluidos":
        this.nenhumCupomLocalizado = false;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaExcluidos;
        this.tabela = "excluidos";
        this.tipo = "excluído";
        if (this.cuponsTemporadaExcluidos!.length == 0) {
          this.nenhumCupomLocalizado = true;
        }
        break;
      case "ativados":
        this.nenhumCupomLocalizado = false;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaAtivos;
        this.tabela = "ativados";
        this.tipo = "ativado";
        if (this.cuponsTemporadaAtivos.length == 0) {
          this.nenhumCupomLocalizado = true;
        }
        break;
      case "desativados":
        this.nenhumCupomLocalizado = false;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaDesativados;
        this.tabela = "desativados";
        this.tipo = "desativado";
        if (this.cuponsTemporadaDesativados.length == 0) {
          this.nenhumCupomLocalizado = true;
        }
        break;
      default:
        this.nenhumCupomLocalizado = false;
        this.cuponsTemporadaASerVisualizado = this.cuponsTemporadaValidos;
        this.tabela = '';
        this.tipo = '';
        if (this.cuponsTemporadaValidos!.length == 0) {
          this.nenhumCupomLocalizado = true;
        }
        break;
    }
  }

  toast(message: string, titulo: string, tipo: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    tipo == "success" ? this.toastr.success(titulo, message) : null;
    tipo == "info" ? this.toastr.info(titulo, message) : null;
    tipo == "warning" ? this.toastr.warning(titulo, message) : null;
    tipo == "error" ? this.toastr.error(titulo, message) : null;
  }
}
