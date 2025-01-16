import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrabalhandoDatasService } from 'src/app/shared/services/trabalhando-datas.service';
import { DisponibilidadeDescontoV1Model } from '../../models/disponibilidade-desconto-v1.model';
import { UpdtadeMargemDisponibilidadeDescontoV1Model } from '../../models/update-margem-disponibilidade-desconto-v1.model.ts';
import { ComunicacaoApiDisponibilidadeDescontoV1Service } from '../../services/comunicacao-api-disponibilidade-desconto-v1.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';

@Component({
  selector: 'app-form-periodo',
  templateUrl: './form-periodo.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormPeriodoComponent implements OnInit {
  //Variáveis de ambiente */
  dataInicio!: string;
  dataFim?: string;
  minDate?: Date;

  // Variáveis a serem preenchidas na chamada do modal
  tipo?: 'novo' | 'editando';
  dadoAAtualizar?: DisponibilidadeDescontoV1Model;

  constructor(
    private loaderService: LoaderService,
    private modalAtivo: NgbActiveModal,
    private trabalhandoDatasService: TrabalhandoDatasService,
    private readonly disponibilidadeDescontoV1Service: ComunicacaoApiDisponibilidadeDescontoV1Service
  ) { }

  ngOnInit(): void {
    switch (this.tipo) {
      case 'editando':
        this.dataInicio = new Date(this.dadoAAtualizar!.dtInicio).toISOString().split('T')[0];
        this.dataFim = new Date(this.dadoAAtualizar!.dtFim).toISOString().slice(0, 10);
        this.minDate = this.trabalhandoDatasService.criandoNewDateUTC0(this.dadoAAtualizar!.dtInicio)
        break;
    }
  }

  /**
   * Função chamada quando o formulário é submetido.
   * Realiza a operação de inclusão ou alteração de uma disponibilidade X desconto.
   * Se a operação for realizada com sucesso, fecha o modal com um objeto ResultV1Model
   * contendo o resultado.
   * Caso contrário, fecha o modal com um objeto ResultV1Model contendo um erro.
   */
  async onSubmit() {
    this.loaderService.startLoader();

    try {
      const disponibilidadeDesconto: {
        _id: string
        dtInicio: Date
        dtFim: Date
      } = {
        _id: '',
        dtInicio: this.trabalhandoDatasService.criandoNewDateUTC0(this.dataInicio),
        dtFim: this.trabalhandoDatasService.criandoNewDateUTC0(this.dataFim!)
      }

      let resultado: ResultV1Model;

      switch (this.tipo) {
        case 'novo':
          // Inclusão de uma nova disponibilidade X desconto
          resultado = await lastValueFrom(
            this.disponibilidadeDescontoV1Service.postNewDisponDesconto(disponibilidadeDesconto)
          ) as ResultV1Model;
          break;
        case 'editando':
          // Alteração de uma disponibilidade X desconto existente
          disponibilidadeDesconto._id = this.dadoAAtualizar!._id
          resultado = await lastValueFrom(
            this.disponibilidadeDescontoV1Service.putUpdateDisponDesconto(disponibilidadeDesconto)
          ) as ResultV1Model;
          break;
      }

      this.modalAtivo.close(resultado!)
    } catch (error) {
      // Tratamento de erros
      if (error instanceof HttpErrorResponse) {
        // Tratamento de erros de HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Fecha o modal sem salvar alterações nos dados de disponibilidade e desconto.
   * Retorna um objeto ResultV1Model com sucesso como falso, um título indicando o cancelamento,
   * uma mensagem vazia, dado nulo e erro nulo.
   */
  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Definição de disponibilidade x desconto cancelada',
        '',
        null,
        null
      )
    );
  }

  /**
   * Retorna o título apropriado com base no tipo de operação.
   * @returns {string} O título correspondente ao tipo de operação.
   */
  get titulo(): string {
    switch (this.tipo) {
      default:
      case 'novo':
        // Retorna o título para uma nova criação de período
        return 'Novo período';
      case 'editando':
        // Retorna o título para a edição de um período existente
        return 'Editando período';
    }
  }
}
