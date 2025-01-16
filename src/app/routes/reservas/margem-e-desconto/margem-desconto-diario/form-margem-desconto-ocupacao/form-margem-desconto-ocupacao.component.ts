import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MargemDescontoDiarioV1Model } from '../models/margem-desconto-diario-v1.model';
import { MargemOcupacaoDiarioV1Model } from '../../margem-desconto-padrao/models/margem-ocupacao-diario-v1.model';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { MargensV1Model } from '../models/margens-v1.model';
import { NewMargemDescontoDiarioV1Model } from '../models/new-margem-desconto-diario-v1.model';
import { NewMargemOcupacaoDiarioV1Model } from '../models/new-margem-ocupacao-diario-v1.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { TrabalhandoDatasService } from 'src/app/shared/services/trabalhando-datas.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunicacaoApiMargemOcupacaoDiarioV1Service } from '../services/comunicaco-api-margem-ocupacao-diario-v1.service';
import { ComunicacaoApiMargemDescontoDiarioV1Service } from '../services/comunicacao-api-margem-desconto-diario-v1.service';

@Component({
  selector: 'app-form-margem-desconto-ocupacao',
  templateUrl: './form-margem-desconto-ocupacao.component.html',
  styleUrl: './form-margem-desconto-ocupacao.component.scss'
})
export class FormMargemDescontoOcupacaoComponent implements OnInit {

  //variaveis dem ambiente
  form: FormGroup;
  margemDescontoDiario!: MargemDescontoDiarioV1Model;
  margemOcupacaoDiario!: MargemOcupacaoDiarioV1Model;
  submitted = false;
  userlogado?: AccountAccessV1Model | null;
  Ocupacao!: boolean;
  editar!: boolean;
  parFormMargemDesc: any;
  newMargemDescontoDiario: MargensV1Model[] = [];
  newMargemOcupacaoDiario: MargensV1Model[] = [];
  newMargemDesconto!: NewMargemDescontoDiarioV1Model;
  newMargemOcupacao!: NewMargemOcupacaoDiarioV1Model

  //variaveis toast
  toaster: any;
  globalConfig: GlobalConfig;

  //referente ao modal
  private modalService = inject(NgbModal);
  resultado = new EventEmitter<ResultV1Model>

  minDate?: Date

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private readonly margemDescontoDiarioV1Service: ComunicacaoApiMargemDescontoDiarioV1Service,
    private readonly margemOcupacaoDiarioV1Service: ComunicacaoApiMargemOcupacaoDiarioV1Service,
    private trabalhandoDatasService: TrabalhandoDatasService,
  ) {
    this.globalConfig = this.toastr.toastrConfig;
    this.form = this.fb.group(this.getFormMargem());
    this.userlogado = SecurityUtil.getAccount();
  }

  ngOnInit(): void {
    this.novoOuUpdate();
  }

  getFormMargem() {
    return {
      margem: ["", Validators.compose([Validators.required])],
      dtinicio: ["", Validators.compose([Validators.required])],
      dtfim: ["", Validators.compose([Validators.required])],
    }
  }

  //função que testa se é uma atuaalização de margens,
  //chamando a função preencheForm() e setanado os dados
  novoOuUpdate() {
    if (this.editar) {
      this.preencheForm()
    }
  }

  //função para setar os dados em caso de update da margem
  async preencheForm() {
    if (this.Ocupacao == false) {
      await this.form.controls["margem"].setValue(
        this.margemDescontoDiario.margemDesconto
      );
      await this.form.controls["dtinicio"].setValue(
        this.trabalhandoDatasService.criandoNewDateUTC0(this.form.controls['dtinicio'].value)
      );
    } else {
      await this.form.controls["margem"].setValue(
        this.margemOcupacaoDiario.margemOcupacao
      );
      await this.form.controls["dtinicio"].setValue(
        this.trabalhandoDatasService.criandoNewDateUTC0(this.form.controls['dtinicio'].value)
      );
    }
  }

  addDay(date: Date, days: number) {
    let date2 = new Date(date);
    date2.setDate(date2.getDate() + days);
    return date2;
  }

  //função que realiza o envio da nova margem cadastrada para o banco de dados
  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.controls['dtinicio'].value) {
      let dtini: Date = new Date(
        new Date(this.form.controls['dtinicio'].value).setUTCHours(0, 0, 0, 0)
      );
      let dtfim: Date = new Date(
        new Date(this.form.controls['dtfim'].value).setUTCHours(0, 0, 0, 0)
      );

      const diff = dtfim.getTime() - dtini.getTime(); // Diferença em milissegundos
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // Diferença em dias
      let dtatual: Date = dtini;


      if (this.Ocupacao == false) {
        if (this.form.controls['dtfim'].value) {
          for (let index = 0; index < dias; index++) {
            this.newMargemDescontoDiario.push({
              margem: this.form.controls['margem'].value,
              data: dtatual,
            });
            index + 1 < dias ? (dtatual = this.addDay(dtatual, 1)) : undefined;
          }
        } else {
          this.newMargemDescontoDiario.push({
            margem: this.form.controls['margem'].value,
            data: dtini,
          });
        }
      } else {
        if (this.form.controls['dtfim'].value) {
          for (let index = 0; index < dias; index++) {
            this.newMargemOcupacaoDiario.push({
              margem: this.form.controls['margem'].value,
              data: dtatual,
            });
            index + 1 < dias ? (dtatual = this.addDay(dtatual, 1)) : undefined;
          }
        } else {
          this.newMargemOcupacaoDiario.push({
            margem: this.form.controls['margem'].value,
            data: dtini,
          });
        }
      }

      /**
       * Consumindo o servico para cadastrar nova margem de "DESCONTO" diário
       */

      if (this.Ocupacao == false) {
        this.newMargemDesconto = {
          margemDesconto: this.newMargemDescontoDiario,
        };

        await this.margemDescontoDiarioV1Service
          .postMargemDescDiario(this.newMargemDesconto, false)
          .subscribe((resultado: ResultV1Model) => {
            this.modalService.dismissAll();
            this.resultado.emit(resultado);
            this.modalService.hasOpenModals;

            if (resultado.error) {
              this.sweetModel(resultado);
            }
          });

      } else {

        this.newMargemOcupacao = {
          margemOcupacao: this.newMargemOcupacaoDiario,
        };

        await this.margemOcupacaoDiarioV1Service
          .postMargemOcupacaoDiario(this.newMargemOcupacao, false)
          .subscribe((resultado: ResultV1Model) => {
            this.modalService.dismissAll();
            this.resultado.emit(resultado);
            this.modalService.hasOpenModals;

            if (resultado.error) {
              this.sweetModel(resultado);
            }
          });
      }
    } else {
      return;
    }
  }

  /**
   * Fecha o modal de margem
   */
  cancela(): void {
    this.modalService.dismissAll()
    this.toast("Cancelado", "Nenhuma alteração foi feita", "warning");
  }

  fechar() {
    this.modalService.dismissAll()
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

    const dia = this.minDate.getDay();

    if (dia === 5 || dia === 6) {
      this.minDate.setDate(this.minDate.getDate() + 2);
    } else {
      this.minDate.setDate(this.minDate.getDate() + 1);
    }
  }

  // modal de possíveis erros
  sweetModel(err: any) {
    Swal.fire({
      title: `${err.titulo}`,
      text: `${err.message}`,
      icon: `warning`,
      backdrop: `rgba(73,80,87,0.50)`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      showConfirmButton: true,
      confirmButtonText: "Atualizar?",
    }).then((result) => {
      if (this.Ocupacao == false) {
        if (result.isConfirmed) {
          this.margemDescontoDiarioV1Service
            .postMargemDescDiario(this.newMargemDesconto, true)
            .subscribe((resultado: ResultV1Model) => {
              /**
               * constroe a variavel de retorno
               */
              this.parFormMargemDesc = {
                success: true,
                title: `${resultado.titulo}`,
                message: `${resultado.message}`,
                typeToaster: resultado.success ? "success" : "error",
              };
              this.modalService.dismissAll(this.parFormMargemDesc);
            });
        } else {
          this.parFormMargemDesc = {
            success: true,
            title: "Nada a fazer",
            message: "Nenhuma ação foi efetuada",
            typeToaster: "info",
          };
          this.modalService.dismissAll(this.parFormMargemDesc);
        }
      } else {
        if (result.isConfirmed) {
          this.margemOcupacaoDiarioV1Service
            .postMargemOcupacaoDiario(this.newMargemOcupacao, true)
            .subscribe((resultado: ResultV1Model) => {
              /**
               * constroe a variavel de retorno
               */
              this.parFormMargemDesc = {
                success: true,
                title: `${resultado.titulo}`,
                message: `${resultado.message}`,
                typeToaster: resultado.success ? "success" : "error",
              };
              this.modalService.dismissAll(this.parFormMargemDesc);
            });
        } else {
          this.parFormMargemDesc = {
            success: true,
            title: "Nada a fazer",
            message: "Nenhuma ação foi efetuada",
            typeToaster: "info",
          };
          this.modalService.dismissAll(this.parFormMargemDesc);
        }
      }
    });
  }

}
