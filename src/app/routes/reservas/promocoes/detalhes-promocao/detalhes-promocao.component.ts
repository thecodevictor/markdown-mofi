import { Component, OnInit, inject } from '@angular/core';
import { PromocaoReservaV1Model } from '../models/promocao-reserva-v1.model';
import { PromocaoTemporadaV1Model } from '../models/promocao-temporada-v1.model';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { FormatarValoresService } from 'src/app/shared/services/formatar-valores.service';
import { TrabalhandoDatasService } from 'src/app/shared/services/trabalhando-datas.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { elementAt } from 'rxjs';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-detalhes-promocao',
  templateUrl: './detalhes-promocao.component.html',
  styleUrl: './detalhes-promocao.component.scss'
})
export class DetalhesPromocaoComponent implements OnInit {

  //variaveis de ambiente
  promocao!: PromocaoReservaV1Model
  isPorcentagemOrValor!: boolean;
  titulo: string = 'Detalhes do pacote';
  beneficios: string[] = [];
  temporadaArray: PromocaoTemporadaV1Model[] = [];

  //variaveis toast
  toster?: ToastrService;
  globalConfig: GlobalConfig

  //referente ao modal
  //private modalService = inject(NgbModal);
  //private modalRef = inject(NgbModalRef);

  constructor(
    public formatarValoresService: FormatarValoresService,
    private toastrService: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    public trabalhandoDatasService: TrabalhandoDatasService,
    private modalService: NgbModal
  ) {
    this.globalConfig = this.toastrService.toastrConfig;
  }

  ngOnInit(): void {
    this.isPorcentagemOrValor = this.promocao.isMargem!;
    this.definindoArrayBeneficios(this.promocao);
    this.definindoArrayTemporada(this.promocao);

    !this.promocao.isTemporada ? this.titulo = "Detalhes da Promoção" : null;
  }

  fecharModal() {
    this.modalService.dismissAll();
  }

  definindoArrayBeneficios(promocao: PromocaoReservaV1Model) {
    if (this.promocao.beneficiosPacote) {
      if (promocao.beneficiosPacote!.includes('\n')) {
        this.beneficios = promocao.beneficiosPacote!.split('\n');
      } else if (promocao.beneficiosPacote!.includes(',')) {
        this.beneficios = promocao.beneficiosPacote.split(',');
      } else if (promocao.beneficiosPacote!.includes(';')) {
        this.beneficios = promocao.beneficiosPacote.split(';');
      } else if (promocao.beneficiosPacote!.includes('.')) {
        this.beneficios = promocao.beneficiosPacote.split('.')
      }
    } else {
      return
    }

    this.beneficios.forEach(
      (beneficio: string, i: number) => {
        if (beneficio === '') {
          this.beneficios.splice(i, 1)
        }
      }
    )
  }

  definindoArrayTemporada(promocao: PromocaoReservaV1Model) {
    this.temporadaArray = promocao.temporada!.filter(element => !element.excluded)
  }

  textoURL() {
    return `https://reservas.hotelctc.com.br/promocao/${this.promocao.codigo}`
  }

  textoVigencia() {
    const dtIniPromocao = new Date(this.promocao.dtIniPromocao);
    const dtFimPromocao = new Date(this.promocao.dtFimPromocao);

    const dtIniPromocaoFormatada = `${this.formatarData(dtIniPromocao)} à ${this.formatarData(dtFimPromocao)}`;

    return dtIniPromocaoFormatada;
  }

  textoEstadia() {
    const dtIniDiaria = new Date(this.promocao.dtIniDiaria);
    const dtFimDiaria = new Date(this.promocao.dtFimDiaria);

    const dtIniDiariaFormatada = `${this.formatarData(dtIniDiaria)} à ${this.formatarData(dtFimDiaria)}`;

    return dtIniDiariaFormatada;
  }

  formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }


  textoMargemDesconto() {
    return `${this.promocao.margemDesconto}%`
  }

  textoValorDesconto() {
    return `${this.formatarValoresService.formatar(this.promocao.valorDesconto)}`
  }

  textoMargemDescontoPix() {
    return `Sim, ${this.promocao.margemDescontoPix}%`
  }

  textoPensaoEscolhida() {
    switch (this.promocao.opEscolhida) {
      case 1:
        return 'Café da manhã';
      case 2:
        return 'Meia Pensão';
      case 3:
        return 'Pensão Completa';
      default:
        return ''
    }
  }

  visualizandoData(data: Date): string {

    // Cria uma nova data com a data fornecida
    const dataMaisUmDia = new Date(data);

    // Adiciona um dia à data
    dataMaisUmDia.setDate(dataMaisUmDia.getDate() + 1);

    // Extrai o dia, mês e ano da nova data
    const dia = String(dataMaisUmDia.getDate()).padStart(2, '0');
    const mes = String(dataMaisUmDia.getMonth() + 1).padStart(2, '0');
    const ano = dataMaisUmDia.getFullYear();
    
    // Retorna a data formatada como uma string no formato "DD/MM/YYYY"
    return `${dia}/${mes}/${ano}`;
  }

  copiarUrlParaClipboard() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = `https://reservas.hotelctc.com.br/promocao/${this.promocao.codigo}`;
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

  toast(message: string, typeToaster: string) {
    this.globalConfig.progressBar = true;
    this.globalConfig.positionClass = "toast-bottom-center"
    typeToaster == 'success' ? this.toastrService.success(message) : null;
    typeToaster == 'info' ? this.toastrService.info(message) : null;
    typeToaster == 'warning' ? this.toastrService.warning(message) : null;
    typeToaster == 'error' ? this.toastrService.error(message) : null;
  }

}