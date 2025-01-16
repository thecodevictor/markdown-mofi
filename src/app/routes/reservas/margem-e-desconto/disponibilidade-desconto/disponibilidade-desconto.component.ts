import { Component, OnInit } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { DisponibilidadeDescontoV1Model } from './models/disponibilidade-desconto-v1.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormPeriodoComponent } from './components/form-periodo/form-periodo.component';
import { ModalMargensDisponDescComponent } from './components/modal-margens-dispon-desc/modal-margens-dispon-desc.component';
import { ComunicacaoApiDisponibilidadeDescontoV1Service } from './services/comunicacao-api-disponibilidade-desconto-v1.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';

@Component({
  selector: 'app-disponibilidade-desconto',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule
  ],
  templateUrl: './disponibilidade-desconto.component.html',
  styles: ``
})
export class DisponibilidadeDescontoComponent implements OnInit {
  //variaveis de ambiente
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  disponDescontoAll: DisponibilidadeDescontoV1Model[] = [];

  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private readonly comunicacaoComApi: ComunicacaoApiDisponibilidadeDescontoV1Service,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.getDisponDesconto()
  }

  /**
   * Busca todos os registros de 'Disponibilidade Desconto' da API,
   * ordena-os por data de incio em ordem decrescente e atualiza o estado do componente.
   * Exibe um loader enquanto busca os dados e lida com erros de forma graciosa.
   */
  async getDisponDesconto() {
    this.disponDescontoAll = [];

    // Inicia o loader
    this.loaderService.startLoader();

    try {
      // Busca dados da API
      const resultado = await lastValueFrom(this.comunicacaoComApi.getAllDisponDesconto()) as ResultV1Model;

      // Verifica se a solicita o da API foi bem sucedida
      if (resultado.success) {
        // Atualiza o estado com os dados ordenados
        this.disponDescontoAll = resultado.data;
        this.disponDescontoAll = this.disponDescontoAll.sort(
          (a, b) => a.dtInicio < b.dtInicio ? 1 : -1
        );
      }
    } catch (error) {
      // Lida com erros HTTP
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        // Log erros n o-HTTP
        console.log('error');
        console.log(error);
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Abre o modal para definir o período de disponibilidade do desconto.
   * Caso o tipo seja 'novo', o modal começa em branco. Caso seja 'editando',
   * o modal já vem preenchido com os dados do período passado como parâmetro.
   * @param tipo Tipo de ação a ser realizada. 'novo' para criar um novo período,
   * 'editando' para editar um período já existente.
   * @param dadoAAtualizar Período de disponibilidade do desconto a ser editado.
   * Caso seja 'novo', este parâmetro é opcional.
   */
  abrirModalDefinirPeriodo(tipo: 'novo' | 'editando', dadoAAtualizar?: DisponibilidadeDescontoV1Model) {
    const modalRef: NgbModalRef = this.modalService.open(
      FormPeriodoComponent,
      {
        keyboard: false,
        centered: true,
        size: 'sm',
        modalDialogClass: "modal-dialog"
      }
    );

    modalRef.componentInstance.tipo = tipo;
    modalRef.componentInstance.dadoAAtualizar = dadoAAtualizar;

    /**
     * Função chamada quando o modal é fechado.
     * Caso o resultado seja sucesso, chama a função getDisponDesconto() para
     * atualizar a lista de disponibilidades. Além disso, chama a função
     * abrirModalDefinirMargens() para definir as margens do desconto.
     * @param resultado Resultado da ação realizada no modal.
     */
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        this.getDisponDesconto();
        this.abrirModalDefinirMargens(resultado.data ?? dadoAAtualizar);
      }

      this.mensagemToastrService.show(
        resultado.titulo,
        resultado.message,
        resultado.success
          ? 'success'
          : (resultado.titulo.includes('cancelada')
            ? 'info'
            : 'error'
          )
      );
    });
  }

  /**
   * Abre o modal para definir as margens de desconto.
   * @param dadoAAtualizar Dado a ser atualizado.
   */
  abrirModalDefinirMargens(dadoAAtualizar: DisponibilidadeDescontoV1Model) {
    const modalRef: NgbModalRef = this.modalService.open(
      ModalMargensDisponDescComponent,
      {
        keyboard: false,
        centered: true,
        size: 'md',
        modalDialogClass: "modal-dialog"
      }
    );
    modalRef.componentInstance.dadoAAtualizar = dadoAAtualizar;

    /**
     * Função chamada quando o modal é fechado.
     * Caso o resultado seja sucesso, chama a função getDisponDesconto() para
     * atualizar a lista de disponibilidades.
     * @param resultado Resultado da ação realizada no modal.
     */
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      this.getDisponDesconto();
      this.mensagemToastrService.show(
        resultado.titulo,
        resultado.message,
        resultado.success
          ? 'success'
          : (resultado.titulo?.includes('fechada')
            ? 'info'
            : 'error'
          )
      );
    });
  }
}
