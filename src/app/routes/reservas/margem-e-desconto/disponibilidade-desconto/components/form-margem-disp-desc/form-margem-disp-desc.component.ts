import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DisponibilidadeDescontoV1Model } from '../../models/disponibilidade-desconto-v1.model';
import { NewMargemDisponibilidadeDescontoV1Model } from '../../models/new-margem-disponibilidade-desconto-v1.model';
import { ComunicacaoApiDisponibilidadeDescontoV1Service } from '../../services/comunicacao-api-disponibilidade-desconto-v1.service';
import { CommonModule } from '@angular/common';
import { DescontoV1Model } from '../../models/desconto-v1.model';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
@Component({
  selector: 'app-form-margem-disp-desc',
  templateUrl: './form-margem-disp-desc.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class FormMargemDispDescComponent implements OnInit {
  //Variáveis de ambiente */
  disponDesc!: DisponibilidadeDescontoV1Model;
  margemDispDesc!: NewMargemDisponibilidadeDescontoV1Model[];
  margemDesconto!: DescontoV1Model;
  margemOcupacao!: DescontoV1Model;
  cont!: number;
  parForm: any;
  form: FormGroup;

  // variáveis a serem preenchidas na chamada do modal
  editar: boolean;
  dadoAAtualizar!: DescontoV1Model;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private modalAtivo: NgbActiveModal,
    private readonly disponibilidadeDescontoV1Service: ComunicacaoApiDisponibilidadeDescontoV1Service
  ) {
    this.form = this.fb.group(
      this.montarForm()
    );
  }

  ngOnInit(): void {
    if (this.editar) {
      // Preenche o formulário com os dados do registro
      this.preencheForm();
    }
  }

  /**
   * Preenche o formulário com os dados do registro.
   * @returns {Promise<void>}
   */
  async preencheForm(): Promise<void> {
    // Preenche o formulário com os dados do registro
    this.form.setValue({
      margemDesconto: [
        this.dadoAAtualizar.margemDesconto
      ],
      margemOcupacao: [
        this.dadoAAtualizar.margemOcupacao
      ]
    });
  }

  /**
   * Cria o formulário com as propriedades e validações necessárias.
   * @returns {object} O formulário criado.
   */
  montarForm(): object {
    return {
      /**
       * Propriedade que armazena a margem de desconto.
       */
      margemDesconto: [
        '',
        /**
         * Validação para a propriedade margemDesconto.
         * A propriedade é obrigatória.
         */
        Validators.compose([
          Validators.required
        ])
      ],
      /**
       * Propriedade que armazena a margem de ocupação.
       */
      margemOcupacao: [
        '',
        /**
         * Validação para a propriedade margemOcupacao.
         * A propriedade é obrigatória.
         */
        Validators.compose([
          Validators.required
        ])
      ]
    }
  }

  /**
   * Lida com o envio do formulário para adicionar ou editar uma margem de disponibilidade e desconto.
   * O formulário é validado antes de enviar os dados para a API.
   * Se o formulário for válido, o método envia os dados para a API:
   * - Se for uma adição, o método chama a API para criar uma nova margem de disponibilidade e desconto.
   * - Se for uma edição, o método chama a API para atualizar a margem de disponibilidade e desconto.
   * Em seguida, fecha o modal com o resultado da operação.
   * Se houver algum erro, o método lida com ele e fecha o modal.
   * @returns {Promise<void>}
   */
  async onSubmit() {
    this.loaderService.startLoader();
    try {
      // Validar formulário
      if (this.form.invalid) {
        throw new Error('Formulário inválido');
      }

      // Preparar dados para enviar
      const dadoAEnviar: {
        _id: string,
        _idDesconto: string,
        margemDesconto: number,
        margemOcupacao: number
      } = {
        _id: this.id,
        _idDesconto: '',
        margemDesconto: parseInt(this.form.controls['margemDesconto'].value),
        margemOcupacao: parseInt(this.form.controls['margemOcupacao'].value)
      }

      let resultado: ResultV1Model;

      if (!this.editar) {
        // Criar uma nova margem
        const response = await lastValueFrom(
          this.disponibilidadeDescontoV1Service.postNewMargemDispDesc(dadoAEnviar)
        ) as any;

        if (response.response) {
          resultado = response.response as ResultV1Model
        } else {
          resultado = response as ResultV1Model
        }

      } else {
        // Atualizar uma margem existente
        dadoAEnviar._idDesconto = this.dadoAAtualizar._id;

        const response = await lastValueFrom(
          this.disponibilidadeDescontoV1Service.putUpdateMargemDispoDesc(dadoAEnviar)
        ) as ResultV1Model;

        resultado = response;
      }

      // Fecha o modal com o resultado da operação
      this.modalAtivo.close(resultado);
    } catch (error) {
      // Lidar com erros
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('erro')
        console.log(error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Fecha o modal sem gravar alterações nos dados de margem de disponibilidade x desconto.
   * Retorna um objeto ResultV1Model com sucesso como falso, um título com o tipo de operação cancelada,
   * uma mensagem vazia, dado nulo e error nulo.
   */
  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        `${this.editar ? 'Edição' : 'Definição'} da margem cancelada`,
        '',
        null,
        null
      )
    );
  }
}
