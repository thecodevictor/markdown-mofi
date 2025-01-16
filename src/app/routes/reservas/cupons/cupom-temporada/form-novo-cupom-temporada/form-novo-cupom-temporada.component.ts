import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { CupomV2Model } from '../../models/cupom-v2.model';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemporadaV1Model } from '../../models/temporada-v1-model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CupomV2Service } from '../../services/cupom-v2.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { CupomTemporadaComponent } from '../cupom-temporada.component';
import { CupomTemporadaV1Model } from '../../models/cupom-temporada-v1-model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { faMonument } from '@fortawesome/free-solid-svg-icons';
import { RemoveOrAddPeriodoV1Model } from '../../models/remove-periodo-v1-model';
import Swal from 'sweetalert2';
import { TrabalhandoDatasService } from 'src/app/shared/services/trabalhando-datas.service';
import { CupomV1Model } from '../../models/cupom-v1.model';
import { NewDisponibilidadeDescontoV1Model } from '../../../margem-e-desconto/disponibilidade-desconto/models/new-disponibilidade-desconto-v1.model';

@Component({
  selector: 'app-form-novo-cupom-temporada',
  templateUrl: './form-novo-cupom-temporada.component.html',
  styleUrl: './form-novo-cupom-temporada.component.scss'
})
export class FormNovoCupomTemporadaComponent implements OnInit {

  //variaveis de ambiente
  userLogado!: AccountAccessV1Model | null;
  titulo!: string;
  isNovoOuEditando: boolean = true; //true para novo e false para editando
  @Output() onClose = new EventEmitter;
  cupom?: CupomV2Model;

  //variaveis do form
  form: FormGroup;
  codecupom!: string;
  porcentagem: boolean = true;
  valorFixo: boolean = false;
  porcent?: number;
  valor?: number;

  obs?: string;
  dtHoje: Date = new Date();

  temporadaArray: TemporadaV1Model[] = [];
  temporadaArrayUpdated: TemporadaV1Model[] = [];

  bsConfig = {
    dateInputFormat: "DD/MM/YYYY",
    containerClass: "theme-green",
    showWeekNumbers: false,
    adaptivePosition: true,
  }

  //Referente ao Modal
  private modalService = inject(NgbModal);
  resultado = new EventEmitter<ResultV1Model>

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private readonly cupomV2Service: CupomV2Service,
    private trabalhandoDatasService: TrabalhandoDatasService,
  ) {
    this.userLogado = SecurityUtil.getAccount();
    this.form = this.formBuilder.group(this.criarFormControls())
  }

  ngOnInit(): void {
    this.isNovoOuEditando
      ? (this.titulo = "Novo Cupom Temporada")
      : ((this.titulo = "Editando Cupom Temporada"), this.preencherForm());
  }

  criarFormControls() {
    return {
      codecupom: ["", Validators.compose([Validators.required])],
      porcent: ["", Validators.pattern(/([0-9])+/g)],
      valor: ["", Validators.pattern(/([0-9])+/g)],
      dtEntrada: [""],
      dtSaida: [""],
      obs: [""],
    }
  }

  preencherForm(update?: TemporadaV1Model) {
    this.form.patchValue({
      codecupom: this.cupom?.codecupom,
      porcent: this.cupom?.porcent,
      valor: this.cupom?.valor
    });

    // Desativa o input de código do cupom
    this.form.get('codecupom')?.disable();

    // Define os valores de porcentagem e valor fixo com base no tipo de cupom
    this.cupom?.tpcupom
      ? ((this.porcentagem = true), (this.valorFixo = false))
      : ((this.porcentagem = false), (this.valorFixo = true));

    // Filtra os elementos da temporada excluídos
    this.temporadaArray = this.cupom!.temporada!.filter(
      (element) => !element.excluded
    );

    this.form.controls['dtEntrada'].setValue(update?.dtEntrada!.toString().slice(0, 10))
    this.form.controls['dtSaida'].setValue(update?.dtSaida!.toString().slice(0, 10))

  }

  async cadastrarNovoCupom() {
    let cupom: CupomTemporadaV1Model = {
      codecupom: this.form.get("codecupom")!.value.toUpperCase(),
      tpcupom: this.porcentagem ? true : false,
      porcent: this.form.get("porcent")!.value,
      valor: this.form.get("valor")!.value,
      temporada: this.temporadaArray,
    };

    this.cupomV2Service
      .postNewCupomTemporada(cupom)
      .subscribe((resultado: ResultV1Model) => {
        this.modalService.dismissAll();
        this.resultado.emit(resultado);
        this.modalService.hasOpenModals;
      });
  }

  visualizandoData(data: Date) {
    let visuData = new NewDisponibilidadeDescontoV1Model(
      this.trabalhandoDatasService.criandoNewDateUTC0(this.form.controls['dtEntrada'].value),
      this.trabalhandoDatasService.criandoNewDateUTC0(this.form.controls['dtSaida'].value)
    );
  }


  async cadastrarEdicaoCupom() {
    let cupom: CupomV2Model = {
      codecupom: this.form.get("codecupom")!.value.toUpperCase(),
      tpcupom: this.porcentagem ? true : false,
      porcent: this.form.get("porcent")!.value,
      valor: this.form.get("valor")!.value,
      temporada: this.cupom!.temporada,
      _Account: this.cupom!._Account,
      _id: this.cupom!._id,
      _idAccount: this.cupom!._idAccount,
      active: this.cupom!.active,
      excluded: this.cupom!.excluded,
      isTemporada: this.cupom!.isTemporada,
      promocional: this.cupom!.promocional,
      unico: this.cupom!.unico,
      used: this.cupom!.used,
      dtinicio: new Date(this.form.controls['dtEntrada'].value),
      dtfim: new Date(this.form.controls['dtSaida'].value),
    };

    let updatedTemporada: RemoveOrAddPeriodoV1Model = {
      _idCupom: this.cupom!._id,
      temporada: this.temporadaArrayUpdated,
    }

    this.cupomV2Service
      .updateCupom(cupom)
      .subscribe((resultado: ResultV1Model) => {
        this.modalService.dismissAll();
        this.resultado.emit(resultado);
        this.modalService.hasOpenModals
      });

    this.cupomV2Service
      .adicionaOrRemovePeriodoTemporada(
        true,
        updatedTemporada
      ).subscribe(() => { })
  }

  isPorcentagemOuValorFixo() {
    this.porcentagem = !this.porcentagem;
    this.valorFixo = !this.valorFixo;

    if (this.porcentagem) {
      this.form.controls['porcent'].addValidators(Validators.required)
      this.form.controls['valor'].removeValidators(Validators.required)
    } else if (this.valorFixo) {
      this.form.controls['valor'].addValidators(Validators.required)
      this.form.controls['porcent'].removeValidators(Validators.required)
    }
  }

  //adiciona o periodo informado ao array
  addPeriodo() {
    if (this.isNovoOuEditando) {
      //true = novo
      if (this.form.get("dtEntrada")!.value && this.form.get("dtSaida")!.value) {
        this.temporadaArray!.push({
          dtEntrada: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtEntrada")!.value)
          ),
          dtSaida: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtSaida")!.value)
          ),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.form.controls["dtEntrada"].reset();
        this.form.controls["dtSaida"].reset();
        this.form.controls["obs"].reset();
      }
    } else {
      // false = editando 
      if (this.form.get("dtEntrada")!.value && this.form.get("dtSaida")!.value) {
        this.temporadaArrayUpdated!.push({
          dtEntrada: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtEntrada")!.value)
          ),
          dtSaida: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtSaida")!.value)
          ),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.temporadaArray!.push({
          dtEntrada: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtEntrada")!.value)
          ),
          dtSaida: new Date(
            this.trabalhandoDatasService.criandoNewDateUTC0(this.form.get("dtSaida")!.value)
          ),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.form.controls["dtEntrada"].reset();
        this.form.controls["dtSaida"].reset();
        this.form.controls["obs"].reset();
      }
    }
  }

  fechar() {
    console.log('fechar')
    this.modalService.dismissAll({
      message: "Nenhum cupom foi criado",
      titulo: "Novo cupom cancelado",
      success: false,
    });
  }


  //Remove um período da lista
  removerPeriodo(periodo: TemporadaV1Model, index: number) {
    Swal.fire({
      title: "Confirma a remoção do período em questão?",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#2cb57e",
      showDenyButton: true,
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cupomV2Service
          .adicionaOrRemovePeriodoTemporada(
            false,
            {
              _idCupom: this.cupom!._id,
              _idTemporada: periodo._id
            }
          )
          .subscribe(
            () => {
              this.temporadaArray.splice(index, 1);
              this.toastr.success(
                `Período não abrange mais o cupom '${this.cupom?.codecupom}'`,
                "Exclusão confirmada"
              );
            });
      }
    });
  }

  resetandoFormControl(qual: string) {
    switch (qual) {
      case "porcentagem":
        this.form.controls["porcent"].reset();
        break;
      case "valor":
        this.form.controls["valor"].reset();
        break;
    }
  }


  minDate(): Date {
    let minDate: Date = this.form.get('dtEntrada')?.value
    return minDate
  }

}



