import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbAlertModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormMargemDispDescComponent } from '../form-margem-disp-desc/form-margem-disp-desc.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { DescontoV1Model } from '../../models/desconto-v1.model';
import { DisponibilidadeDescontoV1Model } from '../../models/disponibilidade-desconto-v1.model';
import { RemoveDescontoMargemV1Model } from '../../models/remove-desconto-margem-v1.model';
import { ComunicacaoApiDisponibilidadeDescontoV1Service } from '../../services/comunicacao-api-disponibilidade-desconto-v1.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';

@Component({
  selector: 'app-modal-margens-dispon-desc',
  templateUrl: './modal-margens-dispon-desc.component.html',
  standalone: true,
  imports: [
    NgbAlertModule,
    CommonModule,
  ]
})
export class ModalMargensDisponDescComponent implements OnInit {
  //Variáveis de ambiente
  margens: DescontoV1Model[] = [];

  // variáveis a serem preenchidas na chamada do modal
  dadoAAtualizar!: DisponibilidadeDescontoV1Model;

  constructor(
    private loaderService: LoaderService,
    private mensagemToastrService: MensagemToastrService,
    private modalService: NgbModal,
    private modalAtivo: NgbActiveModal,
    private readonly comunicacaoComApi: ComunicacaoApiDisponibilidadeDescontoV1Service
  ) { }

  ngOnInit(): void {
    this.getMargens();
  }

  /**
   * Recupera todas as margens de disponibilidade X desconto para
   * a disponibilidade X desconto informada.
   * @returns {Promise<void>}
   */
  async getMargens(): Promise<void> {
    // Inicia o loader
    this.loaderService.startLoader();

    try {
      // Recupera o id da disponibilidade X desconto
      const id = this.dadoAAtualizar._id;

      // Recupera os dados da API
      const resultado = await lastValueFrom(
        this.comunicacaoComApi.getByIdDisponDesconto(id)
      ) as ResultV1Model;

      // Verifica se o resultado foi bem sucedido
      if (resultado.success) {
        // Recupera apenas os descontos
        this.margens = resultado.data.desconto;

        // Ordena as margens de forma decrescente de acordo com a margem de ocupacao
        this.margens.sort((a: DescontoV1Model, b: DescontoV1Model) => {
          return (b.margemOcupacao < a.margemOcupacao) ? -1 : 1;
        });
      }
    } catch (error) {
      // Verifica se o erro é do tipo HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        // Trata o erro
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Abre o modal para adicionar uma nova margem de disponibilidade X desconto
   */
  abrirModalFormMargem(margem?: DescontoV1Model) {
    const modalRef: NgbModalRef = this.modalService.open(
      FormMargemDispDescComponent,
      {
        keyboard: false,
        centered: true,
        size: 'sm',
        modalDialogClass: "modal-dialog"
      }
    );

    //Passando o id da disponibilidade X desconto para o modal
    modalRef.componentInstance.id = this.dadoAAtualizar._id;
    modalRef.componentInstance.dadoAAtualizar = margem;
    modalRef.componentInstance.editar = margem! ? true : false;

    //Fechando o modal e mostrando a mensagem de resultado
    modalRef.closed.subscribe(
      (resultado: ResultV1Model) => {
        if (resultado.success) {
          //Atualizando a lista de margens
          if (resultado.data) {
            this.margens = resultado.data.desconto;
          } else {
            this.getMargens();
          }
        }

        //Mostrando a mensagem de resultado
        this.mensagemToastrService.show(
          resultado.titulo,
          resultado.message,
          resultado.success
            ? 'success'
            : resultado.titulo.includes('cancelada')
              ? 'info'
              : resultado.titulo.includes('fechado')
                ? ''
                : 'error'
        );
      }
    );
  }

  /**
   * Exclui uma margem de disponibilidade X desconto.
   * @param {DescontoV1Model} margem - A margem a ser excluida.
   * @returns {Promise<void>}
   */
  async excluirMargens(margem: DescontoV1Model): Promise<void> {
    // Inicia o loader
    this.loaderService.startLoader();

    const margemAExcluir = new RemoveDescontoMargemV1Model(
      this.dadoAAtualizar._id,
      margem._id
    );

    try {
      // Chama a API para excluir a margem
      const resultado = await lastValueFrom(
        this.comunicacaoComApi.putRemoveMargemDispoDesc(margemAExcluir)
      ) as ResultV1Model;

      // Verifica se o resultado foi bem sucedido
      if (resultado.success) {
        // Atualiza a lista de margens
        this.getMargens();
      }
    } catch (error) {
      // Verifica se o erro é do tipo HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        // Trata o erro
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Fecha o modal sem gravar alterações nos dados de disponibilidade e desconto.
   * Retorna um objeto ResultV1Model com sucesso como falso, um título como 'modal fechado',
   * uma mensagem vazia, dado nulo e error nulo.
   */
  fecharModal(): void {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Definição de disponibilidade x desconto fechada',
        '',
        null,
        null
      )
    )
  }
}