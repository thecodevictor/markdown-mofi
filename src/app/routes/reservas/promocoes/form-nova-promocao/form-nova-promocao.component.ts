import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { NewPromocaoV1Model } from '../models/new-promocao-v1.model';
import { PromocaoReservaV1Model } from '../models/promocao-reserva-v1.model';
import { PromocaoTemporadaV1Model } from '../models/promocao-temporada-v1.model';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { PromocoesV1Service } from '../services/promocoes-v1.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { elementAt } from 'rxjs';
import Swal from 'sweetalert2';
import { UpdatePromocaoTemporadaV1Model } from '../models/update-promocao-temporada-v1-model';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { RemoveOrAddPeriodoTemporadaV1Model } from '../models/remove-or-add-periodo-temporada-v1-model';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';


@Component({
  selector: 'app-form-nova-promocao',
  templateUrl: './form-nova-promocao.component.html',
  styleUrl: './form-nova-promocao.component.scss'
})
export class FormNovaPromocaoComponent implements OnInit {

  //variaveis de ambiente
  titulo!: string;
  codigoPromocao: string = "https://reservas.hotelctc.com.br/promocao/";
  userlogado?: AccountAccessV1Model | null;
  porcentagem: boolean = true;
  criarOrEditar: string = "";
  dtHoje: Date = new Date();
  newPromocao!: NewPromocaoV1Model;
  updatedPromocao!: PromocaoReservaV1Model;
  isPix: boolean = false;
  isOpcao: boolean = true;
  promocaoAEditar!: PromocaoReservaV1Model;

  isPacoteOrPromocao: boolean = false // true = pacote, false = promocao
  isPeriodo: boolean = false; //padrão false
  isTemporada: boolean = true; //padrão true
  isBeneficios: boolean = false; // padrão false

  temporadaArray: PromocaoTemporadaV1Model[] = [];
  temporadaArrayUpdated: PromocaoTemporadaV1Model[] = [];

  resultado = new EventEmitter<ResultV1Model>


  //Form
  form: FormGroup;

  //Variaveis Toast
  toaster?: ToastrService;
  globalConfig: GlobalConfig

  constructor(
    private toastrService: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    private fb: FormBuilder,
    private promocoesV1Service: PromocoesV1Service,
    public route: Router,
    private router: ActivatedRoute,
    public formatarValoresService: FormatarValoresService
  ) {
    this.globalConfig = this.toastrService.toastrConfig;
    this.userlogado = SecurityUtil.getAccount();
    this.form = this.fb.group(this.getFormPromocao());
  }

  ngOnInit(): void {
    switch (this.router.snapshot.params["tipo"]) {
      case "nova-promocao":
        localStorage.removeItem("promocao");
        this.criarOrEditar = "criar";
        this.porcentagem = true;
        this.titulo = "Novo Pacote/Promoção"
        break;

      case "editar-promocao":
        this.criarOrEditar = "editar";
        this.promocaoAEditar = this.getPromocaoLocalStorage();
        this.codigoPromocao = `https://reservas.hotelctc.com.br/promocao/${this.promocaoAEditar.codigo}`;
        this.setarValoresForm();
        this.promocaoAEditar.isMargem
          ? (this.porcentagem = true)
          : (this.porcentagem = false);
        this.promocaoAEditar.isPeriodo
          ? (this.isPeriodo = true)
          : (this.porcentagem = false);
        this.promocaoAEditar.isTemporada
          ? (this.isTemporada = true)
          : (this.isTemporada = false);
        break;

      default:
        this.route.navigate(["/reservas/promocoes"]);
    }
  }

  getFormPromocao() {
    return {
      codigo: ["", Validators.required],
      isTemporada: [this.isTemporada],
      dtIniPromocao: [""],
      dtFimPromocao: [""],
      dtIniDiaria: [""],
      dtFimDiaria: [""],
      dtEntrada: [""],
      dtSaida: [""],
      obs: [""],
      qteReservasPodeVender: ["", Validators.pattern("[0-9]+")],
      isPorcentagem: [""],
      isValor: [""],
      valorDesconto: ["", Validators.pattern("[0-9]+")],
      margemDesconto: [
        "", Validators.compose([Validators.max(100), Validators.pattern("[0-9]+")]),
      ],
      isPix: [this.isPix],
      margemDescontoPix: [
        {
          value: "",
          disabled: this.isPix ? false : true,
        },
        Validators.compose([Validators.max(100), Validators.pattern("[0-9]+")]),
      ],
      opEscolhida: [1],
      qtoAdultos: [
        2,
        Validators.compose([Validators.max(12), Validators.pattern("[0-9]+")]),
      ],
      qtoJovens: [
        0,
        Validators.compose([Validators.max(12), Validators.pattern("[0-9]+")]),
      ],
      beneficiosPacote: [
        {
          value: "",
          disabled: this.isBeneficios ? false : true,
        },
      ],
    };
  }

  //caso seja editar uma promoção, essa função seta os valores que ja estavam definidos previamente, no form
  setarValoresForm() {
    this.isPix = this.promocaoAEditar.isPix!;
    this.promocaoAEditar.beneficiosPacote
      ? (this.isBeneficios = true)
      : (this.isBeneficios = false);

    this.form.setValue({
      codigo: this.promocaoAEditar.codigo,
      isTemporada: this.promocaoAEditar.isTemporada,
      dtEntrada: "",
      dtSaida: "",
      obs: "",
      dtIniPromocao: this.isPeriodo
        ? this.promocaoAEditar.dtIniPromocao
        : "",
      dtFimPromocao: this.isPeriodo
        ? this.promocaoAEditar.dtFimPromocao
        : "",
      dtIniDiaria: this.isPeriodo
        ? this.promocaoAEditar.dtIniDiaria
        : "",
      dtFimDiaria: this.isPeriodo
        ? this.promocaoAEditar.dtFimDiaria
        : "",
      qteReservasPodeVender: this.promocaoAEditar.qteReservasPodeVender,
      isPorcentagem: this.promocaoAEditar.isMargem ? true : false,
      isValor: this.promocaoAEditar.isMargem ? false : true,
      margemDesconto: this.promocaoAEditar.margemDesconto,
      valorDesconto: this.promocaoAEditar.valorDesconto,
      isPix: this.promocaoAEditar.isPix,
      margemDescontoPix: this.promocaoAEditar.margemDescontoPix,
      qtoAdultos: this.promocaoAEditar.qtoAdultos
        ? this.promocaoAEditar.qtoAdultos
        : 0,
      qtoJovens: this.promocaoAEditar.qtoJovens
        ? this.promocaoAEditar.qtoJovens
        : 0,
      opEscolhida: this.promocaoAEditar.opEscolhida,
      beneficiosPacote: this.isBeneficios
        ? this.promocaoAEditar.beneficiosPacote
        : "",
    })
    this.isPix ? this.form.controls["margemDescontoPix"].enable() : null;

    this.temporadaArray = this.promocaoAEditar.temporada!.filter(
      (element) => !element.excluded
    )
  }

  //define se o valor do desconto sera por porcentagem ou fixo
  porcentagemOuValorUnico(opcao: boolean) {
    opcao ? (this.porcentagem = true) : (this.porcentagem = false);
    this.form.patchValue({
      margemDesconto: "",
      valorDesconto: "",
    })
  }

  isItTemporada(opcao: boolean) {
    console.log('opcao:')
    console.log(opcao)
    switch (opcao) {
      case true:
        this.isPeriodo = false;
        this.isTemporada = true;
        this.form.patchValue({ isPeriodo: false });
        this.form.controls["dtEntrada"].reset();
        this.form.controls["dtSaida"].reset();
        this.form.controls["obs"].reset();
        this.form.controls["dtIniPromocao"].removeValidators(Validators.required);
        this.form.controls["dtFimPromocao"].removeValidators(Validators.required);
        this.form.controls["dtIniDiaria"]
        this.form.controls["dtFimDiaria"].removeValidators(Validators.required)
        break;

      case false:
        this.isPeriodo = true;
        this.isTemporada = false;
        this.form.patchValue({
          isPeriodo: true,
          dtIniPromocao: "",
          dtFimPromocao: "",
          dtIniDiaria: "",
          dtFimDiaria: "",
        })

        this.form.controls["dtIniPromocao"].enable();
        this.form.controls["dtIniPromocao"].addValidators(Validators.required)
        this.form.controls["dtIniPromocao"].reset()

        this.form.controls["dtFimPromocao"].enable();
        this.form.controls["dtFimPromocao"].addValidators(Validators.required)
        this.form.controls["dtFimPromocao"].reset()

        this.form.controls["dtIniDiaria"].enable();
        this.form.controls["dtIniDiaria"].addValidators(Validators.required)
        this.form.controls["dtIniDiaria"].reset()

        this.form.controls["dtFimDiaria"].enable();
        this.form.controls["dtFimDiaria"].addValidators(Validators.required)
        this.form.controls["dtFimDiaria"].reset()
        break;
    }
  }

  definirUrl() {
    this.codigoPromocao = `https://reservas.hotelctc.com.br/promocao/${this.form.get("codigo")!.value
      }`;
  }

  copiarUrlParaClipboard() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = `${this.codigoPromocao}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.mensagemToastrService.show(
      "URL da Promoção",
      "URL copiada para a área de transferência",
      "success"
    );
  }

  getPromocaoLocalStorage(): PromocaoReservaV1Model {
    let data = JSON.parse(atob(localStorage.getItem("promocao") as string));

    let promocao: PromocaoReservaV1Model = {
      _Account: data.Account,
      _id: data._id,
      _idAccount: data._idAccount,
      active: data.active,
      codigo: data.codigo,
      isPeriodo: data.isPeriodo,
      isTemporada: data.isTemporada,
      temporada: data.temporada,
      dtFimDiaria: data.dtFimDiaria,
      dtIniDiaria: data.dtIniDiaria,
      dtFimPromocao: data.dtFimPromocao,
      dtIniPromocao: data.dtIniPromocao,
      excluded: data.excluded,
      isMargem: data.isMargem,
      isPix: data.isPix,
      margemDesconto: data.margemDesconto,
      margemDescontoPix: data.margemDescontoPix,
      opEscolhida: data.opEscolhida,
      qteReservasPodeVender: data.qteReservasPodeVender,
      qteReservasVendida: data.qteReservasVendida,
      qtoAdultos: data.qtoAdultos,
      qtoJovens: data.qtoJovens,
      valorDesconto: data.valorDesconto,
      beneficiosPacote: data.beneficiosPacote,
    };

    return promocao;
  }

  definindoTaxaPix(opcao: boolean) {
    opcao
      ? ((this.isPix = true), this.form.controls["margemDescontoPix"].enable())
      : ((this.isPix = false),
        this.form.controls["margemDescontoPix"].disable(),
        this.form.controls["margemDescontoPix"].reset());
  }

  definindoBeneficios(opcao: boolean) {
    opcao
      ? ((this.isBeneficios = true),
        this.form.controls["beneficiosPacote"].enable(), this.form.controls["beneficiosPacote"].reset())
      : ((this.isBeneficios = false),
        this.form.controls["beneficiosPacote"].disable(), this.form.controls["beneficiosPacote"].reset());
  }

  maximoJovensAdultos(tipo: string): number {
    const maximo = 12;

    switch (tipo) {
      case "jovens":
        return maximo - this.form.get("qtoAdultos")!.value;
      case "adultos":
        return maximo - this.form.get("qtoJovens")!.value;
      default:
        return 0;
    }
  }

  validandoInput(formControlName: string): any {
    if (
      (formControlName === "dtIniDiaria" ||
        formControlName === "dtFimDiaria") &&
      this.criarOrEditar === "editar"
    ) {
      return;
    } else {
      if (this.form.controls[formControlName].dirty && this.form.controls[formControlName].errors) {
        return "is-invalid";
      } else if (
        (this.form.controls[formControlName].dirty || this.form.controls[formControlName].pristine) &&
        !this.form.controls[formControlName].errors
      ) {
        return "is-valid";
      }
    }
  }

  mindtFimPromo() {
    if (this.criarOrEditar === "editar") {
      if (
        this.form.controls["dtIniPromocao"].value !=
        this.promocaoAEditar.dtIniPromocao
      ) {
        return new Date(new Date(this.form.controls["dtIniPromocao"].value).setUTCHours(0, 0, 0, 0));
      } else {
        return new Date(new Date(this.promocaoAEditar.dtFimPromocao).setUTCHours(0, 0, 0, 0));
      }
    } else {
      return new Date(new Date(this.form.controls["dtIniPromocao"].value).setUTCHours(0, 0, 0, 0));
    }
  }


  //Adiciona o período informado, ao array
  addPeriodo() {
    if (this.criarOrEditar === "editar") {
      if (
        this.form.get("dtEntrada")!.value &&
        this.form.get("dtSaida")!.value
      ) {
        this.temporadaArrayUpdated!.push({
          dtEntrada: new Date(new Date(this.form.get("dtEntrada")!.value).setUTCHours(0, 0, 0, 0)),
          dtSaida: new Date(new Date(this.form.get("dtSaida")!.value).setUTCHours(0, 0, 0, 0)),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.temporadaArray!.push({
          dtEntrada: new Date(new Date(this.form.get("dtEntrada")!.value).setUTCHours(0, 0, 0, 0)),
          dtSaida: new Date(new Date(this.form.get("dtSaida")!.value).setUTCHours(0, 0, 0, 0)),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.form.controls["dtEntrada"].reset();
        this.form.controls["dtSaida"].reset();
        this.form.controls["obs"].reset();
      }
    } else {
      if (
        this.form.get("dtEntrada")!.value &&
        this.form.get("dtSaida")!.value
      ) {
        this.temporadaArray!.push({
          dtEntrada: new Date(new Date(this.form.get("dtEntrada")!.value).setUTCHours(0, 0, 0, 0)),
          dtSaida: new Date(new Date(this.form.get("dtSaida")!.value).setUTCHours(0, 0, 0, 0)),
          obs: this.form.get("obs")?.value ? this.form.get("obs")?.value : "",
        });

        this.form.controls["dtEntrada"].reset();
        this.form.controls["dtSaida"].reset();
        this.form.controls["obs"].reset();
      }
    }
  }


  //Remove um período da lista
  removerPeriodo(periodo: PromocaoTemporadaV1Model, index: number) {
    if (this.criarOrEditar === "criar") {
      this.temporadaArray.splice(index, 1);
    } else {
      Swal.fire({
        title: "Confirma a remoção do período em questão?",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#2cb57e",
        showDenyButton: true,
        denyButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.promocoesV1Service
            .adicionaOrRemovePeriodoTemporada(false, {
              _idPromocao: this.promocaoAEditar._id,
              _idTemporada: periodo._id,
            })
            .subscribe(() => {
              this.temporadaArray.splice(index, 1);
              this.toastrService.success(
                `Período não abrange mais o pacote '${this.promocaoAEditar.codigo}'`,
                "Exclusão confirmada"
              );
            });
        }
      });
    }
  }


  //Utiliza o serviço para criar uma nova promoção, no banco de dados
  async postNewPromocao() {
    this.newPromocao = {
      codigo: this.form.get("codigo")?.value.toLowerCase(),
      isPeriodo: this.isPeriodo,
      dtIniPromocao: this.isPeriodo
        ? new Date(new Date(this.form.get("dtIniPromocao")?.value).setUTCHours(0, 0, 0, 0)).toISOString()
        : undefined,
      dtFimPromocao: this.isPeriodo
        ? new Date(new Date(this.form.get("dtFimPromocao")?.value).setUTCHours(0, 0, 0, 0)).toISOString()
        : undefined,
      dtIniDiaria: this.isPeriodo
        ? new Date(new Date(this.form.get("dtIniDiaria")?.value).setUTCHours(0, 0, 0, 0)).toISOString()
        : undefined,
      dtFimDiaria: this.isPeriodo
        ? new Date(new Date(this.form.get("dtFimDiaria")?.value).setUTCHours(0, 0, 0, 0)).toISOString()
        : undefined,
      isTemporada: this.isTemporada,
      temporada: this.temporadaArray,
      qteReservasPodeVender: this.form.get("qteReservasPodeVender")?.value
        ? this.form.get("qteReservasPodeVender")?.value
        : undefined,
      isMargem: this.porcentagem ? true : false,
      margemDesconto: this.porcentagem
        ? this.form.get("margemDesconto")?.value
        : undefined,
      valorDesconto: !this.porcentagem
        ? this.form.get("valorDesconto")?.value
        : undefined,
      isPix: this.isPix,
      margemDescontoPix: this.isPix
        ? this.form.get("margemDescontoPix")?.value
        : undefined,
      qtoAdultos: this.form.get("qtoAdultos")?.value
        ? this.form.get("qtoAdultos")?.value
        : undefined,
      qtoJovens: this.form.get("qtoJovens")?.value
        ? this.form.get("qtoJovens")?.value
        : undefined,
      opEscolhida: this.form.get("opEscolhida")?.value,
      beneficiosPacote: this.isBeneficios
        ? this.form.get("beneficiosPacote")?.value
        : undefined,
    };

    this.promocoesV1Service.postNewPromocao(this.newPromocao)
      .subscribe({
        next: (resultado: ResultV1Model) => {
          this.mensagemToastrService.show(
            resultado.titulo,
            resultado.message,
            resultado.success ? "success" : "error"
          );
          this.route.navigate(["/reservas/promocoes"]);
        },
        error: (err) => {
          this.mensagemToastrService.show(err.error.titulo, err.error.error[0], "error");
        },
      });
  }

  //utiliza o serviço para atualizar uma promocao, no banco de dados
  async putUpdatePromocao() {
    if (this.isTemporada) {
      let updatedPromocao: UpdatePromocaoTemporadaV1Model = {
        _id: this.promocaoAEditar._id,
        codigo: this.form.get("codigo")?.value.toLowerCase(),
        isPeriodo: false,
        qteReservasPodeVender: this.form.get("qteReservasPodeVender")?.value,
        qteReservasVendida: this.promocaoAEditar.qteReservasVendida,
        isMargem: this.porcentagem ? true : false,
        margemDesconto: this.porcentagem
          ? this.form.get("margemDesconto")?.value
          : undefined,
        valorDesconto: !this.porcentagem
          ? this.form.get("valorDesconto")?.value
          : undefined,
        isPix: this.isPix,
        margemDescontoPix: this.isPix
          ? this.form.get("margemDescontoPix")?.value
          : undefined,
        qtoAdultos: this.form.get("qtoAdultos")?.value,
        qtoJovens: this.form.get("qtoJovens")?.value,
        opEscolhida: this.form.get("opEscolhida")?.value,
        beneficiosPacote: this.isBeneficios
          ? this.form.get("beneficiosPacote")?.value
          : undefined,
      };

      this.promocoesV1Service
        .putUpdatePromocao(undefined, updatedPromocao)
        .subscribe({
          next: (resultado: ResultV1Model) => {
            this.mensagemToastrService.show(
              resultado.titulo,
              resultado.message,
              resultado.success ? "success" : "error"
            );
            this.route.navigate(["/reservas/promocoes"]);
          },
          error: (err) => {
            this.mensagemToastrService.show(err.error.titulo, err.error.error[0], "error");
          },
        });

      if (this.temporadaArrayUpdated.length > 0) {
        let updatedTemporada: RemoveOrAddPeriodoTemporadaV1Model = {
          _idPromocao: this.promocaoAEditar._id,
          temporada: this.temporadaArrayUpdated,
        };

        this.promocoesV1Service
          .adicionaOrRemovePeriodoTemporada(true, updatedTemporada)
          .subscribe({
            next: (resultado: ResultV1Model) => {
              this.mensagemToastrService.show(
                resultado.titulo,
                resultado.message,
                resultado.success ? "success" : "error"
              );
              this.route.navigate(["/reservas/promocoes"]);
            },
            error: (err) => {
              this.mensagemToastrService.show(err.error.titulo, err.error.error[0], "error");
            },
          });
      }
    } else {
      this.updatedPromocao = {
        _id: this.promocaoAEditar._id,
        _idAccount: this.promocaoAEditar._idAccount,
        _Account: this.promocaoAEditar._Account,
        active: this.promocaoAEditar.active,
        excluded: this.promocaoAEditar.excluded,
        codigo: this.form.get("codigo")?.value.toLowerCase(),
        isPeriodo: this.isPeriodo,
        isTemporada: false,
        temporada: undefined,
        dtIniPromocao: this.isPeriodo
          ? new Date(new Date(this.form.get("dtIniPromocao")!.value).setUTCHours(0, 0, 0, 0)).toISOString()
          : '',
        dtFimPromocao: this.isPeriodo
          ? new Date(new Date(this.form.get("dtFimPromocao")?.value).setUTCHours(0, 0, 0, 0)).toISOString()
          : '',
        dtIniDiaria: this.promocaoAEditar.dtIniDiaria,
        dtFimDiaria: this.promocaoAEditar.dtFimDiaria,
        qteReservasPodeVender: this.form.get("qteReservasPodeVender")?.value,
        qteReservasVendida: this.promocaoAEditar.qteReservasVendida,
        isMargem: this.porcentagem ? true : false,
        margemDesconto: this.porcentagem
          ? this.form.get("margemDesconto")?.value
          : undefined,
        valorDesconto: !this.porcentagem
          ? this.form.get("valorDesconto")?.value
          : undefined,
        isPix: this.isPix,
        margemDescontoPix: this.isPix
          ? this.form.get("margemDescontoPix")?.value
          : undefined,
        qtoAdultos: this.form.get("qtoAdultos")?.value,
        qtoJovens: this.form.get("qtoJovens")?.value,
        opEscolhida: this.form.get("opEscolhida")?.value,
        beneficiosPacote: this.isBeneficios
          ? this.form.get("beneficiosPacote")?.value
          : undefined,
      };

      this.promocoesV1Service
        .putUpdatePromocao(this.updatedPromocao, undefined)
        .subscribe({
          next: (resultado: ResultV1Model) => {
            this.mensagemToastrService.show(
              resultado.titulo,
              resultado.message,
              resultado.success ? "success" : "error"
            );
            this.route.navigate(["/reservas/promocoes"]);
          },
          error: (err) => {
            this.mensagemToastrService.show(err.error.titulo, err.error.error[0], "error");
          },
        });
    }
  }

  /**
  * Cancela e retorna para a página de promoções com toaster de nada feito,
  * quando se trata de uma edição de promoção, esta função tbm remove o item 'promoção'
  * do localstorage
  */
  retornarPaginaPromocoes() {
    this.criarOrEditar === "criar"
      ? this.mensagemToastrService.show(
        "Nova promoção cancelada!",
        "Nenhuma promoção foi criada!",
        "info"
      )
      : (this.mensagemToastrService.show(
        "Edição cancelada!",
        "A promoção não sofreu alterações!",
        "info"
      ),
        localStorage.removeItem("promocao"));
    this.route.navigate(["/reservas/promocoes"]);
  }

  verificarSeData(date: string | Date): boolean {
    if (date) {
      return true;
    } else {
      return false;
    }
  }

  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-right";
    typeToaster == "success"
      ? this.toastrService.success(titulo, message)
      : null;
    typeToaster == "info" ? this.toastrService.info(titulo, message) : null;
    typeToaster == "warning"
      ? this.toastrService.warning(titulo, message)
      : null;
    typeToaster == "error" ? this.toastrService.error(titulo, message) : null;
  }

  definindoMinDate(formControl: string): Date {
    let minDate = this.form.get(`${formControl}`)?.value;
    return minDate;
  }
}
