import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { PromocaoReservaV1Model } from './models/promocao-reserva-v1.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { PromocoesV1Service } from './services/promocoes-v1.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { AtivaDesativaPromocaoV1Model } from './models/ativa-desativa-promocao-v1.model';
import { RemoveRestauraPromocaoV1Model } from './models/remove-restaura-promocao-v1.model';
import { DetalhesPromocaoComponent } from './detalhes-promocao/detalhes-promocao.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-promocoes',
  templateUrl: './promocoes.component.html',
  styleUrl: './promocoes.component.scss'
})
export class PromocoesComponent implements OnInit {

  //icons 
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff

  //variaveis de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  tipoTabela: string = "";
  titulo: string = "Promoções";
  tipo: string = "";
  msgPromocoesNaoEncontradas!: boolean;
  testePemrissoesDeleteAndRestore!: boolean;
  promocoes: PromocaoReservaV1Model[] = [];
  promocoesValidas: PromocaoReservaV1Model[] = [];
  promocoesPorcentagem: PromocaoReservaV1Model[] = [];
  promocoesValorFixo: PromocaoReservaV1Model[] = [];
  promocoesAtivas: PromocaoReservaV1Model[] = [];
  promocoesDesativadas: PromocaoReservaV1Model[] = [];
  promocoesExcluidas: PromocaoReservaV1Model[] = [];

  //Referente ao Modal
  //private modalService = inject(NgbModal);

  //Variaveis Toast
  toaster?: ToastrService;
  globalConfig: GlobalConfig

  constructor(
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private route: Router,
    private modalService: NgbModal,
    public formatarValoresService: FormatarValoresService,
    private promocoesV1Service: PromocoesV1Service,
  ) {
    this.globalConfig = this.toastr.toastrConfig
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getAllPromocoes(this.tipoTabela);
  }

  async getAllPromocoes(tabelaAtual: string) {
    this.zerarTabelas();

    //starter loader
    this.loaderService.startLoader();

    //consumindo serviço de Get All Promocoes
    this.promocoesV1Service
      .getAllPromocoes()
      .subscribe((resultado: ResultV1Model) => {
        resultado.data.forEach((element: PromocaoReservaV1Model) => {
          //desativando a promocao caso esteja excluida e com o status de ativo
          if (element.excluded && element.active) {
            this.ativaDesativaPromocao(element)
          }
        });

        if (resultado.success) {
          resultado.data.forEach((element: PromocaoReservaV1Model) => {
            if (!element.excluded) {
              this.promocoesValidas?.push(element);
            }
            if (element.excluded) {
              this.promocoesExcluidas.push(element);
            } else if (element.isMargem) {
              this.promocoesPorcentagem?.push(element);
            } else {
              this.promocoesValorFixo?.push(element);
            }
            if (element.active) {
              this.promocoesAtivas.push(element);
            } else {
              this.promocoesDesativadas.push(element);
            }
          })
        }
      })

    this.montaTabela(tabelaAtual);

    //stop loader
    this.loaderService.stopLoader();
  }

  //Função responsável por ativar ou desativar a promoção, passando o valor
  //do atributo active para "false" -> desativar ou "true" -> ativar
  async ativaDesativaPromocao(promocao: PromocaoReservaV1Model) {
    let ativaDesativaPromocao: AtivaDesativaPromocaoV1Model = {
      _id: promocao._id!,
      active: !promocao.active!,
    };

    this.promocoesV1Service
      .patchAtivaDesativaPromocao(ativaDesativaPromocao)
      .subscribe((resultado: ResultV1Model) => {
        if (resultado.success) {
          !promocao.active
            ? this.mensagemToastrService.show(
              resultado.titulo,
              `Promoção ${promocao.codigo} foi ativada com sucesso!`,
              "success"
            )
            : this.mensagemToastrService.show(
              resultado.titulo,
              `Promoção ${promocao.codigo} foi desativada com sucesso!`,
              "warning"
            );
          this.getAllPromocoes(this.tipoTabela);
        } else {
          this.mensagemToastrService.show(resultado.titulo, resultado.message, "error");
        }
      });
  }


  //Função responsável por restaurar a promoção, passando o valor
  //do atributo excluded para "false" ou remover, passando o
  //valor do atributo excluded para "true"
  async removeRestauraPromocao(promocao: PromocaoReservaV1Model) {
    let removeOrRestaurarPromocao = new RemoveRestauraPromocaoV1Model(
      promocao._id!,
      !promocao.excluded
    );

    this.promocoesV1Service
      .putRemoveRestauraPromocao(removeOrRestaurarPromocao)
      .subscribe((resultado: ResultV1Model) => {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          !promocao.excluded ? "error" : "success"
        );

        this.getAllPromocoes(this.tipoTabela);
      });
  }

  criarOrEditarPromocao(tipo: string, promocao?: PromocaoReservaV1Model) {
    switch (tipo) {
      case 'criar':
        this.route.navigate(['/reservas/promocoes/nova-promocao'])
        break;
      case 'editar':
        localStorage.removeItem('promocao')
        localStorage.setItem('promocao', btoa(JSON.stringify(promocao)));
        this.route.navigate(['/reservas/promocoes/editar-promocao'])
        break;
    }
  }


  //Função para mostrar detalhes do cupom, eviando os dados para o component "DetalhesCupomComponent"
  //mostrar no modal.

  verDetalhes(promocao: PromocaoReservaV1Model) {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'md',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      DetalhesPromocaoComponent,
      configModal
    );
    modalRef.componentInstance.promocao = promocao
    modalRef.componentInstance.resultado.subscribe((resultado: any) => {
      this.getAllPromocoes(resultado);
      this.mensagemToastrService.show(resultado.titulo, resultado.message, resultado.success ? 'success' : 'error');
    });
  }


  zerarTabelas() {
    this.promocoesValidas = [];
    this.promocoesPorcentagem = [];
    this.promocoesValorFixo = [];
    this.promocoesExcluidas = [];
    this.promocoesAtivas = [];
    this.promocoesDesativadas = [];
  }

  montaTabela(tipo: string) {
    this.promocoes = [];
    switch (tipo) {
      case "%":
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesPorcentagem;
        this.tipoTabela = "%";
        this.tipo = "tipo porcentagem";
        if (this.promocoesPorcentagem!.length == 0) {
          this.msgPromocoesNaoEncontradas = true;
        }
        break;

      case "$":
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesValorFixo;
        this.tipoTabela = "$";
        this.tipo = "tipo valor fixo";
        if (this.promocoesValorFixo!.length == 0) {
          this.msgPromocoesNaoEncontradas = true
        }
        break;

      case "excluidos":
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesExcluidas;
        this.tipoTabela = "excluidos";
        this.tipo = "excluída";
        if (this.promocoesExcluidas!.length == 0) {
          this.msgPromocoesNaoEncontradas = true;
        }
        break;

      case "ativados":
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesAtivas;
        this.tipoTabela = "ativados";
        this.tipo = "ativa";
        if (this.promocoesAtivas.length == 0) {
          this.msgPromocoesNaoEncontradas = true;
        }
        break;

      case "desativados":
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesDesativadas;
        this.tipoTabela = "desativados";
        this.tipo = "desativada";
        if (this.promocoesDesativadas.length == 0) {
          this.msgPromocoesNaoEncontradas = true;
        }
        break;

      default:
        this.msgPromocoesNaoEncontradas = false;
        this.promocoes = this.promocoesValidas;
        this.tipoTabela = "";
        this.tipo = "válida"
        if (this.promocoesValidas!.length == 0) {
          this.msgPromocoesNaoEncontradas = true;
        }
        break;
    }
  }

  //toaster mensagens
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastr.success(titulo, message) : null;
    typeToaster == "info" ? this.toastr.info(titulo, message) : null;
    typeToaster == "warning" ? this.toastr.warning(titulo, message) : null;
    typeToaster == "error" ? this.toastr.error(titulo, message) : null;
  }

}
