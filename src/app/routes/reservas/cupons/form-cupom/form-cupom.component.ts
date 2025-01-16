import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { CupomUnicoV1Model } from '../models/cupom-unico-v1.model';
import { CupomPromocionalV1Model } from '../models/cupom-promocional-v1.model';
import { CupomV2Model } from '../models/cupom-v2.model';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CupomV2Service } from '../services/cupom-v2.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-form-cupom',
  templateUrl: './form-cupom.component.html',
  styleUrl: './form-cupom.component.scss'
})
export class FormCupomComponent implements OnInit {

  //variaveis de ambiente
  titulo?: string;
  btnText: string = 'salvar';
  newOrUpdate!: boolean;
  unico?: boolean;
  porcentagem: boolean = true;
  valorunico: boolean = false;
  cupomUnico!: CupomUnicoV1Model;
  cupomPromocional!: CupomPromocionalV1Model;
  cuponConfere!: CupomV2Model;
  cuponUpdate!: CupomV2Model;
  userLogado?: AccountAccessV1Model | null;
  isUpdate: boolean = false;
  parFormCupom: any;
  tipoCupom: boolean = false;
  permissao?: boolean;
  permissaoUnicoPromocional?: boolean;

  form: FormGroup
  submitted = false;
  formErrors: any;

  private modalService = inject(NgbModal);
  resultado = new EventEmitter<ResultV1Model>


  onClose: string;

  constructor(
    private fb: FormBuilder,
    private cupomV2Service: CupomV2Service,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.userLogado = SecurityUtil.getAccount();
    this.form = this.fb.group(
      this.getFormCupom()
    );
  }


  ngOnInit(): void {
    !this.newOrUpdate ?
      (
        this.cuponConfere = this.cuponUpdate,
        this.preencheCupom(this.cuponUpdate),
        this.titulo = 'Editar cupom'
      ) : this.titulo = 'Novo cupom';

    //this.testePermissaoUnicoOuPromocional();
  }


  async preencheCupom(update?: CupomV2Model) {
    // Preenche o código do cupom e desativa o input
    await this.form.controls['codecupom'].setValue(update?.codecupom);
    await this.form.controls['codecupom'].disable();

    // Define os valores de porcentagem e valor único com base no tipo de cupom
    await this.form.controls['defineporcento'].setValue(this.porcentagem = update?.tpcupom ? true : false);
    await this.form.controls['definevalor'].setValue(!update?.tpcupom ? true : false);

    // Preenche o valor do cupom
    await this.form.controls['valor'].setValue(update?.valor);
    await this.form.controls['porcent'].setValue(update?.porcent);
    this.form.controls['dtinicio'].setValue(update?.dtinicio!.toString().slice(0, 10));
    this.form.controls['dtfim'].setValue(update?.dtfim!.toString().slice(0, 10));


  }

  getFormCupom() {
    return {
      codecupom: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.required
        ])
      ],
      defineporcento: [

      ],
      definevalor: [

      ],
      valor: [

      ],
      porcent: [

      ],
      dtinicio: [
        
        '',
        Validators.compose([
          Validators.required
          
        ])

      ],
      dtfim: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    }
  }

  verificaNumero(numero: any) {
    return numero.toString().replace(",", ".");
  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return
    }

    if (this.unico) {
      if (this.newOrUpdate) {
        this.cupomUnico = {
          codecupom: (this.form.controls['codecupom'].value).toUpperCase(),
          tpcupom: this.porcentagem ? this.porcentagem : false,
          porcent: this.porcentagem ? this.verificaNumero(this.form.controls['porcent'].value) : '',
          valor: !this.porcentagem ? this.verificaNumero(this.form.controls['valor'].value) : '',
          unico: true,
          dtinicio: new Date(this.form.controls['dtinicio'].value),
          dtfim: new Date(this.form.controls['dtfim'].value),
        }

        await this.cupomV2Service
          .postNewCupomUnico(this.cupomUnico)
          .subscribe((resultado: ResultV1Model) => {
            this.modalService.dismissAll();
            this.resultado.emit(resultado)
            this.modalService.hasOpenModals();
          }
          )
      } else {
        let cupom: CupomV2Model = {
          _id: this.cuponUpdate._id,
          _idAccount: this.cuponUpdate._idAccount,
          _Account: this.cuponUpdate._Account,
          excluded: this.cuponUpdate.excluded,
          codecupom: (this.cuponUpdate.codecupom).toUpperCase(),
          tpcupom: this.porcentagem,
          porcent: this.porcentagem ? this.verificaNumero(this.form.controls['porcent'].value) : '',
          valor: !this.porcentagem ? this.verificaNumero(this.form.controls['valor'].value) : '',
          promocional: this.cuponUpdate.promocional,
          unico: this.cuponUpdate.unico,
          active: this.cuponUpdate.active,
          used: this.cuponUpdate.used,
          isTemporada: this.cuponUpdate.isTemporada,
          temporada: this.cuponUpdate.temporada,
          dtinicio: new Date(this.form.controls['dtinicio'].value),
          dtfim: new Date(this.form.controls['dtfim'].value)
        }

        await this.cupomV2Service
          .updateCupom(cupom)
          .subscribe(
            (resultado: ResultV1Model) => {
              this.modalService.dismissAll(resultado);
              this.onClose = 'Ok';
              this.modalService.hasOpenModals();
            }
          );
      }
    } else {
      if (this.newOrUpdate) {
        this.cupomPromocional = {
          codecupom: (this.form.controls['codecupom'].value).toUpperCase(),
          tpcupom: this.porcentagem ? this.porcentagem : false,
          porcent: this.porcentagem ? this.verificaNumero(this.form.controls['porcent'].value) : '',
          valor: !this.porcentagem ? this.verificaNumero(this.form.controls['valor'].value) : '',
          promocional: true,
          dtinicio: new Date(this.form.controls['dtinicio'].value),
          dtfim: new Date(this.form.controls['dtfim'].value)
        }

        await this.cupomV2Service
          .postNewCupomPromocional(this.cupomPromocional)
          .subscribe(
            (resultado: ResultV1Model) => {
              this.modalService.dismissAll();
              this.resultado.emit(resultado);
              this.modalService.hasOpenModals
            }

          )
      } else {
        let cupom: CupomV2Model = {
          _id: this.cuponUpdate._id,
          _idAccount: this.cuponUpdate._idAccount,
          _Account: this.cuponUpdate._Account,
          excluded: this.cuponUpdate.excluded,
          codecupom: (this.cuponUpdate.codecupom).toUpperCase(),
          tpcupom: this.porcentagem,
          porcent: this.porcentagem ? this.verificaNumero(this.form.controls['porcent'].value) : '',
          valor: !this.porcentagem ? this.verificaNumero(this.form.controls['valor'].value) : '',
          promocional: this.cuponUpdate.promocional,
          unico: this.cuponUpdate.unico,
          active: this.cuponUpdate.active,
          used: this.cuponUpdate.used,
          isTemporada: this.cuponUpdate.isTemporada,
          temporada: this.cuponUpdate.temporada,
          dtinicio: new Date(this.form.controls['dtinicio'].value),
          dtfim: new Date(this.form.controls['dtfim'].value)
        }
        await this.cupomV2Service
          .updateCupom(cupom)
          .subscribe((resultado: ResultV1Model) => {
            this.modalService.dismissAll();
            this.resultado.emit(resultado);
            this.modalService.hasOpenModals
          });
      }
    }

  }

  /**
   * Cancela o modal e retorna com toaster de nada feito
   */
  
  cancela(
    message: string,
    titulo: string,
    typeToaster: string,
    type: string
  ): void {
    let resultado = {
      title: `${titulo}`,
      message: `${message}`,
      typeToaster: `${typeToaster}`,
      type: `${type}`
    };
    this.limpaForm();
    this.modalService.dismissAll(resultado);
    this.mensagemToastrService.show(
      '',
      'Cancelado com sucesso!',
      "error"
    );

  }

  porcentagemOuValorUnico() {
    this.porcentagem = !this.porcentagem;
    this.valorunico = !this.valorunico;
  }

  // Limpa formulário.
  limpaForm(): void {
    this.form.reset();
  }

  resetandoDtFim() {
    this.form.controls['dtfim'].reset();
  }

  /**
   * Função para diferenciar o formulário que deve ser aberto referente a permissão.
   * Caso o usuário tenha permissão de criar novo cupom Individual ou Promocional.
   */
  // testePermissaoUnicoOuPromocional(): void {
  //   if (
  //     this.userLogado?._rulesAccount._rulesReservas.menuCupom.rulesCupomUnico.rcu_isNewCupomUnico == true &&
  //     this.userLogado?._rulesAccount!._rulesReservas.menuCupom.rulesCupomPromocional.rcp_isNewCupomPromocional == true
  //   ) {
  //     this.permissao = true
  //   } else if (
  //     this.userLogado?._rulesAccount._rulesReservas.menuCupom.rulesCupomUnico.rcu_isNewCupomUnico == false &&
  //     this.userLogado?._rulesAccount!._rulesReservas.menuCupom.rulesCupomPromocional.rcp_isNewCupomPromocional == true ||
  //     this.userLogado?._rulesAccount._rulesReservas.menuCupom.rulesCupomUnico.rcu_isNewCupomUnico == true &&
  //     this.userLogado?._rulesAccount!._rulesReservas.menuCupom.rulesCupomPromocional.rcp_isNewCupomPromocional == false
  //   ) {
  //     this.permissao = false
  //   }
  // }
}
