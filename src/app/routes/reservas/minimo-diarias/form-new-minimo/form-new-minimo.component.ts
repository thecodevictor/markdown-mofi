import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { ComunicacaoApiLimiteDiariasV1Service } from '../service/comunicacao-api-limite-diarias-v1.service';
import { LimiteDiariasV1Model } from '../models/limite-diarias-v1-model';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';

@Component({
  selector: 'app-form-new-minimo',
  templateUrl: './form-new-minimo.component.html',
  styleUrl: './form-new-minimo.component.scss'
})
export class FormNewMinimoComponent implements OnInit {
  /**Variáveis de Ambiente */
  minimoDiarias!: number;
  maximoDiarias!: number;
  dataAAplicarOLimite: string;
  fazerNovoGet = new EventEmitter();
  data!: Date;

  //bsDatePicker configurações:
  dtHoje?: Date = new Date();

  /**
   *
   */
  constructor(
    public ModalService: NgbModal,
    private mensagemToastrService: MensagemToastrService,
    private limiteDiariasService: ComunicacaoApiLimiteDiariasV1Service,
  ) { }

  /**
   * Inicializa o componente.
   *
   * Se a variável `data` for informada, define o valor da variável `dataAAplicarOLimite` como
   * o dia seguinte à data informada. Caso contrário, define o valor como o dia corrente.
   */
  ngOnInit(): void {
    if (this.data) {
      // Adiciona 1 dia à data informada
      const dataObj = new Date(this.data);
      dataObj.setDate(dataObj.getDate() + 1);

      // Define o valor da variável `dataAAplicarOLimite`
      this.dataAAplicarOLimite = new Date(dataObj).toISOString().split('T')[0];
    } else {
      // Define o valor da variável `dataAAplicarOLimite` como o dia corrente
      this.dataAAplicarOLimite = new Date().toISOString().split('T')[0];
    }
  }


  fecharModal() {
    this.ModalService.dismissAll();
  }


  async salvarLimite() {
    const dataFormatada = this.dataAAplicarOLimite;

    const novoLimite: LimiteDiariasV1Model = {
      data: dataFormatada,
      minimo: this.minimoDiarias ?? 0,
      maximo: this.maximoDiarias ?? 0
    }

    try {
      const resultado = await lastValueFrom(this.limiteDiariasService.postNovoLimite(novoLimite))

      this.mensagemToastrService.show(
        resultado.message,
        resultado.titulo,
        resultado.success ? "success" : "error"
      );
      this.fecharModal();
      this.fazerNovoGet.emit(true);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error: ', error);
      }
    }

  }

  adicionarZero(numero: number) {
    return numero < 10 ? '0' + numero : numero;
  }
}