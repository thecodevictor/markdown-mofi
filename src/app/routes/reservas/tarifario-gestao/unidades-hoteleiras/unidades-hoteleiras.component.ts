import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { ComunicacaoApiTarifarioV1Service } from 'src/app/routes/home/dashboard/services/comunicacao-api-tarifario-v1.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { TipoUhV1Model } from '../models/tipo-uh-v1.model';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { FormUhComponent } from '../components/form-uh/form-uh.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { DetalhesTipoUhV1Model } from 'src/app/routes/home/dashboard/models/detalhes-tipo-uh-v1.model';
import Swal from 'sweetalert2';

export interface HotelV1Model {
  idHotel: number,
  nomeHotel: string,
}

@Component({
  selector: 'app-unidades-Hoteleiras',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgbTooltipModule,
    NgbDropdownModule
  ],
  templateUrl: './unidades-hoteleiras.component.html',
  styles: ``
})
export class UnidadesHoteleirasComponent implements OnInit, OnDestroy {
  // variáveis de ambiente
  $unsubscribe = new Subject<void>();
  listaUh: TipoUhV1Model[] = [];
  listaUhEsolution: DetalhesTipoUhV1Model[] = [];
  listaUhsNaoCadastrados: DetalhesTipoUhV1Model[] = [];
  listaHoteis: HotelV1Model[] = [];

  //variáveis paginação
  paginaAtual = 1;

  constructor(
    private comunicacaoComApiTarifario: ComunicacaoApiTarifarioV1Service,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService,
  ) { }

  ngOnInit(): void {
    this.getTiposUH();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  /**
   * @description
   * Recupera a lista de Unidades Hoteleiras
   * @returns {Promise<void>}
   * @memberof UnidadesHoteleirasComponent
   */
  async getTiposUH(): Promise<void> {
    this.loaderService.startLoader();
    try {
      const resultado = await lastValueFrom(
        this.comunicacaoComApiTarifario.getListaUh()
      );
      // Atualiza a lista de Unidades Hoteleiras
      this.listaUh = resultado.data.sort((a: TipoUhV1Model, b: TipoUhV1Model) => a.nomeHotel!.localeCompare(b.nomeHotel!));

      if (this.listaUh.length > 0) {
        this.listaHoteis = this.definirListaHoteisCadastrados();
      }

      this.obterListaUhsEsolution();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Trata o erro de forma generica
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * @description
   * Abre o modal para criar uma nova Unidade Hoteleira ou editar uma existente
   * @param {TipoUhV1Model} [uh] - Unidade Hoteleira a ser editada
   * @returns {void}
   * @memberof UnidadesHoteleirasComponent
   */
  abrirModalCadastrarOuEditarUH(uh?: TipoUhV1Model, modalOpcoes?: NgbModalOptions): void {
    const modalRef = this.modalService.open(
      FormUhComponent,
      modalOpcoes ??
      {
        size: 'sm',
        centered: true,
      }
    )

    // Passa o valor da Unidade Hoteleira para o component
    modalRef.componentInstance.uhSelecionado = uh;
    modalRef.componentInstance.listaHoteis = this.listaHoteis;
    modalRef.componentInstance.isNovoUh = modalOpcoes ? true : (uh ? false : true);

    // Trata o resultado do modal
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      this.mensagemToastrService.show(
        // Mostra a mensagem de acordo com o resultado
        resultado.message,
        resultado.titulo,
        resultado.success ? 'success' : (resultado.message.includes('cancelada') ? 'info' : 'error')
      )

      // Se o resultado for sucesso, atualiza a lista de Unidades Hoteleiras
      resultado.success ? this.getTiposUH() : null
    })
  }

  /**
   * @description
   * Faz a lista de hotéis cadastrados baseado na lista de Unidades Hoteleiras
   * @returns {HotelV1Model[]} - A lista de hotéis cadastrados
   * @memberof UnidadesHoteleirasComponent
   */
  definirListaHoteisCadastrados(): HotelV1Model[] {
    const lista = this.listaUh.map(uh => {
      return {
        idHotel: uh.idHotel!,
        nomeHotel: uh.nomeHotel!
      }
    })

    // Cria um Map para armazenar os dados unicos
    const dadosUnicos = new Map<string, HotelV1Model>();

    // Percorre a lista e adiciona os dados unicos no Map
    lista.forEach(
      item => {
        dadosUnicos.set(item.idHotel + item.nomeHotel, item);
      }
    );

    // Converte o Map para um array e retorna
    return Array.from(dadosUnicos.values());
  }

  /**
   * @description
   * Verifica se existem Unidades Hoteleiras não cadastradas.
   * 
   * Compara a lista de Unidades Hoteleiras cadastradas com a lista de Unidades Hoteleiras do Esolution
   * e retorna aquelas que ainda não foram cadastradas.
   * 
   * @returns {Array<any>} - Lista de Unidades Hoteleiras não cadastradas.
   */
  obterListaUhsEsolution() {
    // Verifica se a lista de Unidades Hoteleiras do Esolution existe em local storage
    if (localStorage.getItem('listaUhEsolution')) {
      // Converte a lista de Unidades Hoteleiras do Esolution para um array
      this.listaUhEsolution = JSON.parse(atob(localStorage.getItem('listaUhEsolution')!));
    } else {
      // Se a lista não existir, seta a lista como vazia
      this.listaUhEsolution = [];
    }

    // Verifica se existem Unidades Hoteleiras que ainda não foram cadastradas
    if (this.listaUhEsolution.length > 0) {
      // Filtra as Unidades Hoteleiras do Esolution que não estão cadastradas
      this.listaUhsNaoCadastrados = this.verificarSeTemUhACadastrar();
    } else {
      // Se a lista de Unidades Hoteleiras do Esolution estiver vazia, seta a lista de Unidades Hoteleiras não cadastradas como vazia
      this.listaUhsNaoCadastrados = [];
    }

    // Se existirem Unidades Hoteleiras que ainda não foram cadastradas, exibe um alerta para cada uma delas
    if (this.listaUhsNaoCadastrados.length > 0) {
      this.listaUhsNaoCadastrados.forEach(uh => {
        // Cria um objeto de TipoUhV1Model para cada Unidade Hoteleira que ainda não foi cadastrada
        const tipoUh = new TipoUhV1Model();
        tipoUh.idHotel = uh.idHotel;
        tipoUh.idTipoUh = uh.idUH;
        tipoUh.nomeHotel = uh.hotel;
        tipoUh.nomeTipoUh = uh.nomeUH;

        // Exibe um alerta para cada Unidade Hoteleira que ainda não foi cadastrada
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'A unidade hoteleria ' + uh.nomeUH + ' ainda nao foi cadastrada. Necessário cadastrá-la.',
          showCancelButton: false,
          confirmButtonText: 'Sim',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          // Abre o modal para cadastrar a Unidade Hoteleira
          this.abrirModalCadastrarOuEditarUH(
            tipoUh,
            {
              size: 'sm',
              centered: true,
              backdrop: 'static',
              keyboard: false
            }
          );
        })
      })
    }
  }

  /**
   * @description
   * Verifica se existem Unidades Hoteleiras não cadastradas.
   * 
   * Compara a lista de Unidades Hoteleiras cadastradas com a lista de Unidades Hoteleiras do Esolution
   * e retorna aquelas que ainda não foram cadastradas.
   * 
   * @returns {Array<any>} - Lista de Unidades Hoteleiras não cadastradas.
   */
  verificarSeTemUhACadastrar(): Array<any> {
    // Mapeia os IDs das Unidades Hoteleiras cadastradas
    const idsUhsCadastrados = this.listaUh.map(uh => uh.idTipoUh) as Array<number>;

    // Filtra as Unidades Hoteleiras do Esolution que não estão cadastradas
    const listaUhNaoCadastrados = this.listaUhEsolution.filter(uh => {
      const isIncluded = idsUhsCadastrados.includes(uh.idUH);
      return !isIncluded;
    });

    // Retorna a lista de Unidades Hoteleiras não cadastradas
    return listaUhNaoCadastrados;
  }
}
