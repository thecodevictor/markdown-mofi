import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { DatasIndisponiveisV1Model } from './models/datas-indisponiveis-v1.model';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { ComunicacaoApiDatasIndisponiveisV1Service } from './services/comunicacao-api-datas-indisponiveis-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { DatasIndisponiveisV1Dto } from './models/datas-indisponiveis-v1-dto';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { FormNovaDataIndisponivelComponent } from './form-nova-data-indisponivel/form-nova-data-indisponivel.component';

@Component({
  selector: 'app-datas-indisponiveis',
  templateUrl: './datas-indisponiveis.component.html',
  styleUrl: './datas-indisponiveis.component.scss'
})
export class DatasIndisponiveisComponent implements OnInit {

  // Variaveis Toast
  globalConfig: GlobalConfig;
  datesDisabled!: Date[];


  /** variavei de ambiente */
  paginaAtual: number = 1;
  userlogado?: AccountAccessV1Model | null;
  tabela: string = "";
  titulo: string = "Data(s) encontrada(s)";
  tituloFiltro: string = "Todas";
  userLogado!: AccountAccessV1Model | null;

  dataAtual: Date = new Date();
  mesAtual = this.dataAtual.getMonth() + 1;

  janeiro!: DatasIndisponiveisV1Model[];
  fevereiro!: DatasIndisponiveisV1Model[];
  marco!: DatasIndisponiveisV1Model[];
  abril!: DatasIndisponiveisV1Model[];
  maio!: DatasIndisponiveisV1Model[];
  junho!: DatasIndisponiveisV1Model[];
  julho!: DatasIndisponiveisV1Model[];
  agosto!: DatasIndisponiveisV1Model[];
  setembro!: DatasIndisponiveisV1Model[];
  outubro!: DatasIndisponiveisV1Model[];
  novembro!: DatasIndisponiveisV1Model[];
  dezembro!: DatasIndisponiveisV1Model[];

  datasIndisponiveis!: DatasIndisponiveisV1Model[];

  constructor(
    private modalService: NgbModal,
    private readonly datasIndisponiveisV1Service: ComunicacaoApiDatasIndisponiveisV1Service,
    private toastr: ToastrService,
    private mensagemToastrService: MensagemToastrService,
    public loaderService: LoaderService
  ) {
    this.userLogado = SecurityUtil.getAccount();
    this.globalConfig = this.toastr!.toastrConfig;
  }

  ngOnInit(): void {
    this.getDataIndisponiveis();
  }

  async getDataIndisponiveis() {
    this.datasIndisponiveis = [];
    this.datesDisabled = [];
    await this.datasIndisponiveisV1Service.getAllDatas().subscribe(
      (resultado: ResultV1Model) => {
        /**
         * Populando os meses com as datas recebidas do banco
         * caso não tenha, popula o mês com um Array vazio.
         */
        if (resultado.success) {
          if (resultado.data._1.length > 0) {
            this.janeiro = resultado.data._1;
            const dataAtual = new Date(); 
            this.janeiro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data); // Converte a data do elemento para um objeto Date
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate); // Cria uma nova data com base na data do elemento
                newDate.setDate(newDate.getDate() + 2); // Adiciona 2 dias à nova data
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.janeiro = [];
          }
          if (resultado.data._2.length > 0) {
            this.fevereiro = resultado.data._2;
            const dataAtual = new Date();
            this.fevereiro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.fevereiro = [];
          }
          if (resultado.data._3.length > 0) {
            this.marco = resultado.data._3;
            const dataAtual = new Date();
            this.marco.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.marco = [];
          }
          if (resultado.data._4.length > 0) {
            this.abril = resultado.data._4;
            const dataAtual = new Date();
            this.abril.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.abril = [];
          }
          if (resultado.data._5.length > 0) {
            this.maio = resultado.data._5;
            const dataAtual = new Date();
            this.maio.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.maio = [];
          }
          if (resultado.data._6.length > 0) {
            this.junho = resultado.data._6;
            const dataAtual = new Date();
            this.junho.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.junho = [];
          }
          if (resultado.data._7.length > 0) {
            this.julho = resultado.data._7;
            const dataAtual = new Date();
            this.julho.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.julho = [];
          }
          if (resultado.data._8.length > 0) {
            this.agosto = resultado.data._8;
            const dataAtual = new Date();
            this.agosto.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.agosto = [];
          }
          if (resultado.data._9.length > 0) {
            this.setembro = resultado.data._9;
            const dataAtual = new Date();
            this.setembro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.setembro = [];
          }
          if (resultado.data._10.length > 0) {
            this.outubro = resultado.data._10;
            const dataAtual = new Date();
            this.outubro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.outubro = [];
          }
          if (resultado.data._11.length > 0) {
            this.novembro = resultado.data._11;
            const dataAtual = new Date();
            this.novembro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.novembro = [];
          }
          if (resultado.data._12.length > 0) {
            this.dezembro = resultado.data._12;
            const dataAtual = new Date();
            this.dezembro.forEach((element: DatasIndisponiveisV1Model) => {
              const elementDate = new Date(element.data);
              if (elementDate >= dataAtual) {
                const newDate = new Date(elementDate);
                newDate.setDate(newDate.getDate() + 2);
                this.datesDisabled.push(new Date (newDate));
              }
            });
          } else {
            this.dezembro = [];
          }
          this.organizandoDatas();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Organiza a visualização das datas começando pelo mês atual
   */
  organizandoDatas() {
    switch (this.mesAtual) {
      //caso o mês atual seja Janeiro
      case 1:
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Fevereiro
      case 2:
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Março
      case 3:
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Abril
      case 4:
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Maio
      case 5:
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Junho
      case 6:
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Julho
      case 7:
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Agosto
      case 8:
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Setembro
      case 9:
        this.outubro.length
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Outubro
      case 10:
        this.outubro.length
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Novembro
      case 11:
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso o mês atual seja Dezembro
      case 12:
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        break;
      //caso Default que ajusta começando pelo mês de Janeiro
      default:
        this.janeiro.length > 0
          ? this.janeiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.fevereiro.length > 0
          ? this.fevereiro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.marco.length > 0
          ? this.marco.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.abril.length > 0
          ? this.abril.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.maio.length > 0
          ? this.maio.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.junho.length > 0
          ? this.junho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.julho.length > 0
          ? this.julho.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.agosto.length > 0
          ? this.agosto.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.setembro.length > 0
          ? this.setembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.outubro.length > 0
          ? this.outubro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.novembro.length > 0
          ? this.novembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
        this.dezembro.length > 0
          ? this.dezembro.forEach((element) =>
            this.datasIndisponiveis.push(element)
          )
          : null;
    }
  }

  disponibilizarOrIndisponibilizarData(status: boolean, dado: any) {
    let dadosASeremEnviados: DatasIndisponiveisV1Dto = {
      _id: status ? null : dado,
      datasIndisp: status ? dado : null,
    };
    this.datasIndisponiveisV1Service
      .disponibilizarOrIndisponibilizarData(status, dadosASeremEnviados)
      .subscribe(
        (resultado: ResultV1Model) => {
        if (resultado.success) {
          this.mensagemToastrService.show(resultado.message, resultado.titulo, "success");
          this.getDataIndisponiveis();
        } else {
          this.mensagemToastrService.show(resultado.message, resultado.titulo, "error");
        }
      });
  }

  /**
   * Abrindo o modal para criar nova indisponibilidade
   */
  openFormNewIndisponibilidade() {
    let configModal = {
      keyboard: false,
      centered: true,
      size: 'sm',
      modalDialogClass: "modal-dialog"
    }
    let modalRef: NgbModalRef = this.modalService.open(
      FormNovaDataIndisponivelComponent,
      configModal
    );
    modalRef.componentInstance.datesDisabled = this.datesDisabled
    modalRef.componentInstance.onClose.subscribe(() => {
      this.getDataIndisponiveis()
    })
  }

  // Mensagem Toast
  toast(message: string, titulo: string, typeToaster: string) {
    this.globalConfig!.progressBar = true;
    this.globalConfig!.positionClass = "toast-bottom-right";
    typeToaster == "success" ? this.toastr!.success(titulo, message) : null;
    typeToaster == "info" ? this.toastr!.info(titulo, message) : null;
    typeToaster == "warning" ? this.toastr!.warning(titulo, message) : null;
    typeToaster == "error" ? this.toastr!.error(titulo, message) : null;
  }
}
