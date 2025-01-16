import { Component, } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { LimiteDiariasV1Model } from './models/limite-diarias-v1-model';
import { ComunicacaoApiLimiteDiariasV1Service } from './service/comunicacao-api-limite-diarias-v1.service';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormNewMinimoComponent } from './form-new-minimo/form-new-minimo.component';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';

@Component({
  selector: 'app-minimo-diarias',
  templateUrl: './minimo-diarias.component.html',
  styleUrl: './minimo-diarias.component.scss'
})
export class MinimoDiariasComponent {

  //varivaies de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  limitesFull!: LimiteDiariasV1Model[];
  limitesValido!: LimiteDiariasV1Model[];
  limitesExcluido!: LimiteDiariasV1Model[];
  limites: LimiteDiariasV1Model[] = [];
  tipoTabela: string = "validos";
  dtHoje = new Date//(moment().format("YYYY-MM-DD"))

  //Variaveis toastr
  globalConfig: GlobalConfig;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private minimoDiariasService: ComunicacaoApiLimiteDiariasV1Service
  ) {
    this.userlogado = SecurityUtil.getAccount();
    this.globalConfig = this.toastr.toastrConfig;
    this.getLimitesDeDiarias()
  }

  async getLimitesDeDiarias() {
    this.limitesFull = [];
    this.limitesExcluido = [];
    this.limitesValido = [];

    /**Inicia o loader */
    this.loaderService.startLoader();

    try {
      const resultado = await lastValueFrom(this.minimoDiariasService.getAll());
      if (resultado.success) {
        this.limitesFull = resultado.data;

        /**
         * Excluíndo o mínimo, caso a data seja menor que a data de hoje
         * e alimentando a tabela de mínimos excluídos
         */
        resultado.data.forEach((el: LimiteDiariasV1Model) => {
          el.data! < new Date(this.dtHoje.setUTCHours(0, 0, 0, 0)).toISOString() && !el.excluded
            ? (el.excluded = true)
            : null;
          el.excluded
            ? this.limitesExcluido.push(el)
            : this.limitesValido.push(el);
        });

        /**Organizando as tabelas do menor para o maior (em ordem crescente) */
        this.limitesFull.sort((a, b) => (b.data! > a.data! ? -1 : 1));
        this.limitesExcluido
          ? this.limitesExcluido.sort((a, b) => (b.data! > a.data! ? -1 : 1))
          : null;
        this.limitesValido
          ? this.limitesValido.sort((a, b) => (b.data! > a.data! ? -1 : 1))
          : null;

        this.montaTabela(this.tipoTabela);
      } else {
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          "error"
        );
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error: ', error);
      }
    } finally {
      /**Finaliza o loader */
      this.loaderService.stopLoader();
    }
  }

  /**
  * Função que remove o mínimo definido, alterando o excluded
  * de false para true
  */
  removeLimiteDiarias(limite: LimiteDiariasV1Model) {
    this.minimoDiariasService
      .postRemoverLimite({
        _id: limite._id,
      })
      .subscribe((resultado: ResultV1Model) => {
        this.getLimitesDeDiarias();

        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          resultado.success ? "success" : "error"
        );
      });
  }

  /**
   * Abre um modal para definir um novo limite diário.
   */
  abrirModalNovoLimite() {
    // Configura as configurações do modal
    const modalRef: NgbModalRef = this.modalService.open(
      FormNewMinimoComponent,
      {
        keyboard: false, // Desabilita os atalhos de teclado para fechar o modal
        centered: true, // Centraliza o modal na tela
        size: 'sm', // Define o tamanho do modal como pequeno
        modalDialogClass: "modal-dialog" // Classe CSS personalizada para o diálogo do modal
      }
    );

    // Se inscreve no evento 'fazerNovoGet' para atualizar os limites diários quando o modal fecha
    modalRef.componentInstance.fazerNovoGet.subscribe(() => {
      this.getLimitesDeDiarias();
    });
  }

  montaTabela(tipo: string) {
    switch (tipo) {
      case "":
        this.limites = this.limitesFull;
        this.tipoTabela = "";
        break;
      case "validos":
        this.tipoTabela = "validos";
        this.limites = this.limitesValido;
        break;
      case "excluidos":
        this.tipoTabela = "excluidos";
        this.limites = this.limitesExcluido;
        break;
    }
  }
}
