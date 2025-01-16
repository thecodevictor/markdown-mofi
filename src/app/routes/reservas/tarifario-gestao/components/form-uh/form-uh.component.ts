import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoUhV1Model } from '../../models/tipo-uh-v1.model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { ComunicacaoApiTarifarioV1Service } from 'src/app/routes/home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { lastValueFrom } from 'rxjs';
import { FormReativoService } from 'src/app/shared/services/form-reativo.service';
import { HotelV1Model } from '../../unidades-hoteleiras/unidades-hoteleiras.component';

@Component({
  selector: 'app-form-uh',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ComunicacaoApiTarifarioV1Service
  ],
  templateUrl: './form-uh.component.html',
  styles: ``
})
export class FormUhComponent implements OnInit {
  title: string = 'Nova UH';
  listaHoteis: HotelV1Model[] = [];
  formUh: FormGroup;
  novoHotel: string = '';

  // variáveis a serem preenchidas na chamada do modal
  uhSelecionado?: TipoUhV1Model;
  isNovoUh?: boolean;
  isAcessandoPeloMapaDiario?: boolean;

  constructor(
    private modalAtivo: NgbActiveModal,
    private fb: FormBuilder,
    private comunicacaoApiTarifario: ComunicacaoApiTarifarioV1Service,
    public formReativo: FormReativoService
  ) {
    this.formUh = this.fb.group(this.montarFormUh());
  }

  ngOnInit(): void {
    if (!this.isNovoUh) {
      this.title = 'Editar UH'
      this.preencherForm();
    } else if (this.uhSelecionado) {
      this.preencherForm();
    }
  }

  montarFormUh() {
    return {
      nomeHotel: ['', Validators.required],
      nomeTipoUh: ['', Validators.required],
      totalQuartos: ['', Validators.required],
    }
  }

  preencherForm() {
    this.formUh.patchValue({
      nomeHotel: this.uhSelecionado?.nomeHotel,
      nomeTipoUh: this.uhSelecionado?.nomeTipoUh,
      totalQuartos: this.uhSelecionado?.totalQuartos,
    });
  }

  get controls() {
    return this.formUh.controls;
  }

  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Unidades Hoteleiras',
        `A ${this.uhSelecionado ? 'edição' : 'criação'} da Unidade Hoteleira foi cancelada.`,
        null,
        null
      )
    );
  }

  /**
   * @description
   * Função chamada quando o formulário é submetido.
   * Ela verifica se o formulário é válido e, se for, envia a requisição para a API.
   * @returns {Promise<void>}
   */
  async onSubmit(): Promise<void> {
    try {
      // Verificar se o formulário é válido
      if (this.formUh.invalid || (this.controls['nomeHotel'].value == 'naoLocalizei' && !this.novoHotel)) {
        const novoHotelEl = document.getElementById('nomeHotel') as HTMLInputElement;
        novoHotelEl.focus();
        if (!this.novoHotel && this.controls['nomeHotel'].value == 'naoLocalizei') {
          novoHotelEl.classList.add('border-danger');
        } else {
          novoHotelEl.classList.add('border-success');
        }
        return;
      }

      // Criar um objeto com os dados da UH
      const uh: TipoUhV1Model = {
        /**
         * Se a UH estiver sendo editada, o _id da UH é passado.
         * Caso contrário, ele é undefined.
         */
        _id: this.uhSelecionado ? this.uhSelecionado._id : undefined,
        /**
         * Nome do tipo de UH.
         */
        nomeTipoUh: this.controls['nomeTipoUh'].value,
        /**
         * Total de quartos da UH.
         */
        totalQuartos: parseInt(this.controls['totalQuartos'].value),
      }

      // Se o usuário escolheu um hotel, verificar se ele existe na lista de hotéis
      if (this.controls['nomeHotel'].value == 'naoLocalizei') {
        // Se o usuário informou 'naoLocalizei' então ele adicionará um novo hotel, que não consta na lista
        uh.nomeHotel = this.novoHotel;
        uh.idHotel = this.definirProximoIdHotel()
      } else {
        // Senão, será utilizado o nome e o id do hotel selecionado.
        uh.nomeHotel = this.controls['nomeHotel'].value;

        if (this.isAcessandoPeloMapaDiario) {
          uh.idHotel = this.uhSelecionado?.idHotel;
          uh.idTipoUh = this.uhSelecionado?.idTipoUh;
        }

        if (this.isNovoUh && this.uhSelecionado) {
          uh.idHotel = this.uhSelecionado?.idHotel;
          uh.idTipoUh = this.uhSelecionado?.idTipoUh;
        }

        if (!this.isAcessandoPeloMapaDiario && !(this.isNovoUh && this.uhSelecionado)) {
          uh.idHotel = this.listaHoteis.find(
            hotel => hotel.nomeHotel == this.controls['nomeHotel'].value
          )!.idHotel;
        }
      }
      // Enviar a requisição para a API
      const resultado = await lastValueFrom(this.comunicacaoApiTarifario.criarOuEditarUH(
        uh,
        (this.uhSelecionado && !this.isAcessandoPeloMapaDiario && !this.isNovoUh) ? 'update' : 'new'
      ));

      // Verificar se a requisição foi bem sucedida
      if (resultado.success) {
        const mensagem = `A ${(this.uhSelecionado && !this.isAcessandoPeloMapaDiario && !this.isNovoUh) ? 'edição' : 'criação'} da Unidade Hoteleira foi realizada com sucesso.`;

        this.modalAtivo.close(
          new ResultV1Model(
            true,
            'Unidades Hoteleiras',
            mensagem,
            null,
            null
          )
        );
      } else {
        this.modalAtivo.close(resultado);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error: ', error)
      }
    }
  }


  /**
   * @description
   * Define o próximo ID de hotel para um novo hotel.
   * Ele percorre a lista de hotéis e verifica qual o maior ID atual.
   * E soma 1 para criar o novo ID.
   * @returns {number} - O próximo ID de hotel.
   */
  definirProximoIdHotel(): number {
    let proximoId: number = 0;
    this.listaHoteis.forEach(hotel => {
      if (hotel.idHotel > proximoId) {
        proximoId = hotel.idHotel + 1;
      }
    });

    return proximoId;
  }
}
