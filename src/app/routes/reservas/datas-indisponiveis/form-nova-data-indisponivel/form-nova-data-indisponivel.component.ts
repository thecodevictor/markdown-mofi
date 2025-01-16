import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { DatasV1Model } from '../models/datas-v1.model';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargemOcupacaoDiarioV1Model } from '../../margem-e-desconto/margem-desconto-padrao/models/margem-ocupacao-diario-v1.model';
import { MargemDescontoDiarioV1Model } from '../../margem-e-desconto/margem-desconto-diario/models/margem-desconto-diario-v1.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { ComunicacaoApiDatasIndisponiveisV1Service } from '../services/comunicacao-api-datas-indisponiveis-v1.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { SecurityUtil } from 'src/app/_core/utils/security.util';

@Component({
  selector: 'app-form-nova-data-indisponivel',
  templateUrl: './form-nova-data-indisponivel.component.html',
  styleUrl: './form-nova-data-indisponivel.component.scss'
})
export class FormNovaDataIndisponivelComponent implements OnInit {

  //resultado = new EventEmitter<ResultV1Model>

  /**
   * Variáveis de ambiente
   */
  form: FormGroup;
  margemDescontoDiario!: MargemDescontoDiarioV1Model;
  margemocupacaoDiario!: MargemOcupacaoDiarioV1Model;
  submitted = false;
  userlogado?: AccountAccessV1Model | null;
  Ocupacao!: boolean;
  editar!: boolean;
  parFormMargemDesc: any;
  @Output() onClose = new EventEmitter()
  datesDisabled?: Date[];

  datasASeremIndisponibilizadas: DatasV1Model[] = [];

  // Variaveis Toast
  globalConfig: GlobalConfig;

  /**
   * datapicker config
  */
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private datasIndisponiveisService: ComunicacaoApiDatasIndisponiveisV1Service
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.form = this.fb.group(this.getFormDatasIndisponiveis());
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void { }

  // Irrelevante para a documentação
  get f() {
    return this.form.controls;
  }

  getFormDatasIndisponiveis() {
    return {
      dtInicio: ["", Validators.compose([Validators.required])],
      dtFim: ["", Validators.compose([])],
    };
  }


  getDatas() {
    if (this.form.controls['dtInicio'].value && !this.form.controls['dtFim'].value) {
      let dataInicial = new Date(new Date(this.form.controls['dtInicio'].value).setUTCHours(0, 0, 0, 0));
      this.datasASeremIndisponibilizadas.push({
        data: dataInicial
      });
    } else if (this.form.controls['dtInicio'].value && this.form.controls['dtFim'].value) {
      let dataInicial = new Date(new Date(this.form.controls['dtInicio'].value).setUTCHours(0, 0, 0, 0));
      let dataFinal = new Date(new Date(this.form.controls['dtFim'].value).setUTCHours(0, 0, 0, 0));

      // Calcula a diferença em dias
      let diferencaEmMS = dataFinal.getTime() - dataInicial.getTime();
      let dias = diferencaEmMS / (1000 * 60 * 60 * 24) + 1;

      let dtAtual: Date = dataInicial;
      for (let index = 0; index < dias; index++) {
        this.datasASeremIndisponibilizadas.push({
          data: dtAtual
        });
        let dia: Date = new Date(dtAtual);

        dia.setUTCDate(dtAtual.getUTCDate() + 1)
        dtAtual = dia;
      }
    }
  }

  async enviarDatas() {
    if (this.form.invalid) {
      return;
    }
    try {
      this.getDatas();
      if (this.datasASeremIndisponibilizadas.length > 0) {
        this.datasIndisponiveisService
          .disponibilizarOrIndisponibilizarData(
            true,
            {
              datasIndisp: this.datasASeremIndisponibilizadas
            }
          )
          .subscribe({
            next: (resultado: ResultV1Model) => {
              if (resultado.success) {
                this.onClose.emit(resultado);
                this.modalService.dismissAll();
                this.mensagemToastrService.show(
                  resultado.message,
                  resultado.titulo,
                  "success"
                );
              } else {
                this.mensagemToastrService.show(resultado.message, resultado.titulo, "error");
                console.log('resultado error');
                console.log(resultado);
              }
            },
          });
      }
    } catch (e) {
      if (e) {
        console.log(e);
      }
    }
  }

  /**
   * Fecha o modal de margem
   */
  cancela(): void {
    this.modalService.dismissAll();
    this.mensagemToastrService.show("Cancelado", "Nenhuma alteração foi feita", "warning");
    console.log('cancelado')
  }

  fechar() {
    this.modalService.dismissAll();
    console.log('fechado')
  }

  // Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastr.success(titulo, message) : null;
    typeToaster == "info" ? this.toastr.info(titulo, message) : null;
    typeToaster == "warning" ? this.toastr.warning(titulo, message) : null;
    typeToaster == "error" ? this.toastr.error(titulo, message) : null;
  }

  onValueChange(value: Date): void {
    this.minDate = new Date(value);
  }

}

