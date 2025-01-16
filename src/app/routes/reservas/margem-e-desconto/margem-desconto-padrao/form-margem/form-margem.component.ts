import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NewMargemOcupacaoPadraoV1Model } from '../models/new-margem-ocupacao-padrao-v1.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComunicacaoApiMargemOcupacaoPadraoV1Service } from '../services/comunicacao-api-margem-ocupacao-padrao-v1.service';
import { NewMargemDescontoPadraoV1Model } from '../models/new-margem-desconto-padrao-v1.model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { ComunicacaoApiMargemDescontoPadraoV1Service } from '../services/comunicacao-api-margem-desconto-padrao-v1.service';

@Component({
  selector: 'app-form-margem',
  templateUrl: './form-margem.component.html',
  styleUrl: './form-margem.component.scss'
})
export class FormMargemComponent implements OnInit {

  //Variável vindo com valor booleano do comnponente que há acionou.
  //Se true cai na condição de "nova margem de desconto padrão", se false
  //cai na condição de "nova margem de ocupação padrão".
  OcupacaoOrDesconto?: boolean;

  //Variável a ser populada e enviada para criação de nova margem de Ocupação
  newMargemOcupacao!: NewMargemOcupacaoPadraoV1Model;

  //referente ao modal
  private modalService = inject(NgbModal);



  // Variaveis Toast
  toaster: any;
  globalConfig: GlobalConfig;

  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService,
    private margemOcupacaoPadraoV1Service: ComunicacaoApiMargemOcupacaoPadraoV1Service,
    private margemDescontoPadraoV1Service: ComunicacaoApiMargemDescontoPadraoV1Service,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.form = this.fb.group(
      this.getFormMargem()
    );
  }

  getFormMargem() {
    return {
      margem: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
    }
  }

  ngOnInit(): void {

  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    //Fazendo o casting
    parseInt(this.form.controls['margem'].value);

    //Starter Loader
    this.loaderService.startLoader();


    //Consumindo o serviço para criar "nova margem de desconto padrão."
    if (this.OcupacaoOrDesconto) {
      if (this.form.controls['margem'].value < 0 || this.form.controls['margem'].value > 100) {
        this.mensagemToastrService.show(
          'Valor inválido !',
          this.OcupacaoOrDesconto ? 'O valor da margem de desconto deve ser entre 0 e 100.' : 'O valor da margem de ocupação deve ser entre 0 e 100.',
          'error'
        );
      } else {
        let newMargem = new NewMargemDescontoPadraoV1Model(
          this.form.controls['margem'].value.replace(',', '.')
        )

        await this.margemDescontoPadraoV1Service
          .PostnewMargensDescontoPadrao(newMargem).subscribe(
            (resultado: ResultV1Model) => {
              this.modalService.dismissAll();
              window.location.reload();
              this.mensagemToastrService.show(
                resultado.titulo,
                resultado.message,
                resultado.success ? 'success' : 'error'
              );
            }
          )
      }

      //Stop Loader
      this.loaderService.stopLoader();
    } else if (this.form.controls['margem'].value < 0 || this.form.controls['margem'].value > 100) {
      this.mensagemToastrService.show(
        'Valor inválido !',
        this.OcupacaoOrDesconto ? 'O valor da margem de desconto deve ser entre 0 e 100.' : 'O valor da margem de ocupação deve ser entre 0 e 100.',
        'error'
      );
    } else {
      //Consumindo o serviço para criar "nova margem de ocupação padrão."
      this.newMargemOcupacao = new NewMargemOcupacaoPadraoV1Model(
        this.form.controls['margem'].value.replace(',', '.')
      )

      await this.margemOcupacaoPadraoV1Service
        .PostAllMargensOcupacaoPadrao(this.newMargemOcupacao).subscribe(
          (resultado: ResultV1Model) => {
            this.modalService.dismissAll();
            window.location.reload();
            this.mensagemToastrService.show(
              resultado.titulo,
              resultado.message,
              resultado.success ? 'success' : 'error'
            );
          }
        )
    }

    //Stop Loader
    this.loaderService.stopLoader();
  }

  /**
   * Fecha o modal de margem
   */
  cancela(): void {
    this.modalService.dismissAll();
    this.mensagemToastrService.show(
      this.OcupacaoOrDesconto ? 'Nova margem de desconto cancelada!' : 'Nova margem de ocupação cancelada!',
      'Nenhuma margem foi criada',
      'warning'
    );
  }

  fechar() {
    this.modalService.dismissAll();
  }

  // Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == 'success' ? this.toastr.success(titulo, message) : null;
    typeToaster == 'info' ? this.toastr.info(titulo, message) : null;
    typeToaster == 'warning' ? this.toastr.warning(titulo, message) : null;
    typeToaster == 'error' ? this.toastr.error(titulo, message) : null;
  };
}


