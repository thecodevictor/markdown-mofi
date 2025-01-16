import { Component, OnInit } from '@angular/core';
import { ComunicacaoApiMapaDiarioV1Service } from '../services/comunicacao-api-mapa-diario-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MapaDispV1Model } from '../models/mapa-disp-v1.model';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from '../services/mapa-diario-comunicacao-entre-componentes-v1.service';
import { TabelaMapaDiarioComponent } from './components/tabela-mapa-diario/tabela-mapa-diario.component';
import Swal from 'sweetalert2';
import { TabelaControleMotorVendasComponent } from './components/tabela-controle-motor-vendas/tabela-controle-motor-vendas.component';
import { FiltroPeriodoComponent } from './components/filtro-periodo/filtro-periodo.component';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../services/tarifario-comunicacao-entre-componentes-v1.service';
import { DetalhesTipoUhV1Model } from '../models/detalhes-tipo-uh-v1.model';

interface NavTabsMapaDiario {
  title: string;
  labelEmissao: string;
}

@Component({
  selector: 'app-mapa-diario',
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    TabelaMapaDiarioComponent,
    TabelaControleMotorVendasComponent,
    NgbNavModule
  ],
  templateUrl: './mapa-diario.component.html',
  styles: ``
})
export class MapaDiarioComponent implements OnInit {
  // variáveis de ambiente
  $unsubscribe = new Subject<void>();
  isPeriodo: boolean = false;
  dtHoje = new Date();
  dtInicio: Date = this.dtHoje;
  margemDescontoPadrao: number = 0;
  margemOcupacaoPadrao: number = 0;
  tabAtivado: number = 0;
  dtDaqui25dias: Date;
  mapaAdtur: MapaDispV1Model[];
  mapaSaphire: MapaDispV1Model[];
  navTabsMapaDiario: NavTabsMapaDiario[] = [
    {
      title: 'Hotel Adtur',
      labelEmissao: 'adtur'
    },
    {
      title: 'Hotel Saphire',
      labelEmissao: 'saphire'
    }
  ];

  constructor(
    private comunicacaoComApi: ComunicacaoApiMapaDiarioV1Service,
    private loaderService: LoaderService,
    private comunicacaoEntreComponentes: MapaDiarioComunicacaoEntreComponentesV1Service,
    private tarifarioComunicacaoEntreComponentes: TarifarioComunicacaoEntreComponentesV1Service,
    private modalService: NgbModal
  ) {
    this.comunicacaoEntreComponentes.margemDescontoPadrao
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        margem => this.margemDescontoPadrao = margem
      );

    this.comunicacaoEntreComponentes.margemOcupacaoPadrao
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        margem => this.margemOcupacaoPadrao = margem
      )
  }

  ngOnInit(): void {
    this.definirDataDaqui25dias();
    this.getMapaDiario(this.dtInicio);
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  /**
   * Abre o modal de filtro de período com as opções especificadas.
   * 
   * @returns {void}
   */
  abrirFiltroPeriodoModal() {
    // Abre o modal com as opções especificadas
    const modalRef = this.modalService.open(
      FiltroPeriodoComponent,
      {
        size: 'sm',
        centered: true
      }
    );

    // Manipula o evento de fechamento do modal
    modalRef.componentInstance.dataSelecionada.subscribe(
      (data: Date) => {
        // Atualiza a data de início e recalcula a data dos próximos 25 dias
        this.dtInicio = data;
        this.definirDataDaqui25dias(data);

        // Indica se o período foi selecionado
        this.isPeriodo = true;

        // Busca o mapa diário dos hotéis com base na data de início
        this.getMapaDiario(this.dtInicio);
      });
  }

  /**
   * Busca o mapa diário dos hotéis do Adtur,
   * CTC e Saphire com base nas datas informadas.
   * 
   * @returns {Promise<void>}
   */
  async getMapaDiario(dataIni: Date): Promise<void> {
    this.mapaAdtur = [];
    this.mapaSaphire = [];
    this.loaderService.startLoader();
    try {
      // Chama a API para recuperar o mapa diário
      const resultado = await lastValueFrom(this.comunicacaoComApi.getMapaDiarioAdtur(
        {
          dataInicial: dataIni.toISOString().slice(0, 10),
          dataFinal: this.dtDaqui25dias.toISOString().slice(0, 10)
        }
      ));

      // Verifica se o resultado foi bem sucedido
      if (resultado.success) {
        // Atualiza os mapas diários dos hotéis
        this.mapaAdtur = resultado.data.mapaAdtur;
        this.mapaSaphire = resultado.data.mapaSaphire;
        this.emitirOMapaDiarioDoHotelSelecionado('adtur');
        this.salvarListaUhEsolutionNoLocalStorage(resultado.data)
      } else {
        Swal.fire(
          resultado.titulo,
          resultado.message,
          'error'
        )
      }

      // Para o loader
      this.loaderService.stopLoader();
    } catch (error) {
      // Verifica se o erro é um erro HTTP
      if (error instanceof HttpErrorResponse) {
        // Trata o erro HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        // Mostra o erro
        console.log('error: ', error);
      }

      // Para o loader
      this.loaderService.stopLoader();
    }
  }

  /**
   * Define a data 25 dias a partir da data de hoje,
   * e chama a função para buscar o mapa diário
   */
  definirDataDaqui25dias(dataIni: Date = this.dtHoje) {
    this.dtDaqui25dias = new Date(dataIni.getTime() + (24 * 60 * 60 * 1000) * 25);
    this.comunicacaoEntreComponentes.emitirPeriodoConsulta(
      { dtInicial: dataIni, dtFinal: this.dtDaqui25dias }
    );
  }

  /**
   * Emite o mapa diário do hotel selecionado para o componente
   * responsável por exibir o mapa diário.
   * 
   * @param {string} hotel - O nome do hotel cujo mapa diário deve ser emitido.
   */
  emitirOMapaDiarioDoHotelSelecionado(hotel: string) {
    switch (hotel) {
      // Mapa diário do Adtur
      case 'adtur':
        this.comunicacaoEntreComponentes.emitirMapaSelecionado(this.mapaAdtur);
        break;
      // Mapa diário do Saphire
      case 'saphire':
        this.comunicacaoEntreComponentes.emitirMapaSelecionado(this.mapaSaphire);
        break;
      // Caso nenhuma das opções acima seja verdadeira, não faz nada.
      default:
        break;
    }
  }

  /**
   * Emite a lista de UHs unificada e agrupada por hotel
   * para o componente responsável por exibir a lista de UHs.
   * 
   * @param {object} mapas - Um objeto contendo as listas de UHs do Adtur
   * e Saphire.
   * @param {MapaDispV1Model[]} mapas.mapaAdtur - A lista de UHs do Adtur.
   * @param {MapaDispV1Model[]} mapas.mapaSaphire - A lista de UHs do Saphire.
   */
  salvarListaUhEsolutionNoLocalStorage(mapas: {
    mapaAdtur: MapaDispV1Model[],
    mapaSaphire: MapaDispV1Model[]
  }) {
    const primeiroElementoAdtur = mapas.mapaAdtur[0];
    const primeiroElementoSaphire = mapas.mapaSaphire[0];

    // Adiciona o nome e o id do hotel às UHs do Adtur
    primeiroElementoAdtur.mapaDiario.forEach((uh: DetalhesTipoUhV1Model) => {
      uh.hotel = mapas.mapaAdtur[0].hotel;
      uh.idHotel = mapas.mapaAdtur[0].idHotel;
    });

    // Adiciona o nome e o id do hotel às UHs do Saphire
    primeiroElementoSaphire.mapaDiario.forEach((uh: DetalhesTipoUhV1Model) => {
      uh.hotel = mapas.mapaSaphire[0].hotel;
      uh.idHotel = mapas.mapaSaphire[0].idHotel;
    });

    // Cria uma lista unificada e agrupada por hotel
    const listaUhUnificada = [
      ...new Set(
        [...primeiroElementoAdtur.mapaDiario, ...primeiroElementoSaphire.mapaDiario]
      )
    ] as DetalhesTipoUhV1Model[];

    if (localStorage.getItem('listaUhEsolution')) {
      localStorage.removeItem('listaUhEsolution');
    }
    // Salva a lista unificada no localStorage
    localStorage.setItem('listaUhEsolution', btoa(JSON.stringify(listaUhUnificada)));
  }
}