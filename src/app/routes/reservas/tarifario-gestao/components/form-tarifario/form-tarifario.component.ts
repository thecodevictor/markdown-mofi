import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatepickerRangeComponent } from 'src/app/shared/components/datepicker-range/datepicker-range.component';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComunicacaoApiTarifarioV1Service } from 'src/app/routes/home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

export interface NovoTarifarioV1Interface {
  isParticular: boolean;
  isGrupo: boolean;
  dtInicio: Date;
  dtFinal: Date;
  nomeTarifario: string;
  regrasEBloqueios: {
    quantidadeMinEMaxDiarias: {
      isQuantidadeMinima: boolean;
      quantidadeMinima?: number;
      isQuantidadeMaxima: boolean;
      quantidadeMaxima?: number;
    }
  }
}

@Component({
  selector: 'app-form-tarifario',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DatepickerRangeComponent,
  ],
  providers: [
    ComunicacaoApiTarifarioV1Service,
  ],
  templateUrl: './form-tarifario.component.html',
})
export class FormTarifarioComponent implements OnInit {
  tarifarioForm: FormGroup;
  dtInicio: Date;
  dtFinal: Date;
  $unsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private comunicacaoComApi: ComunicacaoApiTarifarioV1Service,
    private loaderService: LoaderService,
    private mensagemToastr: MensagemToastrService,
    private modalAtivo: NgbActiveModal,
  ) {
    this.tarifarioForm = this.fb.group(this.montarFormTarifario());
  }

  ngOnInit(): void {
    DatepickerRangeComponent.datasSelecionadas
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(datas => {
        if (datas) {
          this.dtInicio = datas.fromDate;
          this.dtFinal = datas.toDate;
        }
      })

    this.controls['isParticular'].disable();
  }

  montarFormTarifario() {
    return {
      isParticular: [true, Validators.required],
      nomeTarifario: ['', Validators.required],
    }
  }

  get controls() {
    return this.tarifarioForm.controls;
  }

  /**
   * Envia o formulário para a API e retorna o resultado.
   *
   * Se o resultado for positivo, redireciona para a página de cadastro de tarifas.
   * Se o resultado for negativo, exibe uma mensagem de erro.
   *
   * @returns void
   */
  async onSubmit() {
    this.loaderService.stopLoader();

    /**
     * Cria o objeto que será enviado para a API.
     * O mesmo é baseado na interface NovoTarifarioV1Interface.
     */
    const novoTarifario: NovoTarifarioV1Interface = {
      dtFinal: this.dtFinal,
      dtInicio: this.dtInicio,
      isGrupo: false, // Sempre false porque ainda não temos desenvolvido, a opção de reserva para grupos.
      isParticular: this.controls['isParticular'].value,
      nomeTarifario: this.controls['nomeTarifario'].value.toUpperCase(),
      regrasEBloqueios: {
        quantidadeMinEMaxDiarias: {
          isQuantidadeMaxima: false,
          isQuantidadeMinima: false,
        }
      }
    };

    try {
      /**
       * Chama a API e espera o resultado.
       * O resultado é tratado na variável resultado.
       */
      const resultado = await lastValueFrom(this.comunicacaoComApi.postNovoTarifario(novoTarifario, novoTarifario.isParticular));

      if (resultado.success) {
        this.modalAtivo.close(resultado);
      } else {
        this.mensagemToastr.show(
          resultado!.message,
          resultado!.titulo,
          "error"
        )
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Novo tarifário',
        'A criação do tarifário foi cancelada.',
        null,
        null
      )
    )
  }
}