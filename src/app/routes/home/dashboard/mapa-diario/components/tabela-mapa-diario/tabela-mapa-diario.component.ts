import { Component, OnDestroy } from '@angular/core';
import { MapaDiarioComunicacaoEntreComponentesV1Service } from '../../../services/mapa-diario-comunicacao-entre-componentes-v1.service';
import { CommonModule } from '@angular/common';
import { MapaDispV1Model } from '../../../models/mapa-disp-v1.model';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { DetalhesTipoUhV1Model } from '../../../models/detalhes-tipo-uh-v1.model';
import { ComunicacaoApiTarifarioV1Service } from '../../../services/comunicacao-api-tarifario-v1.service';
import { TipoUhV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tipo-uh-v1.model';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormUhComponent } from 'src/app/routes/reservas/tarifario-gestao/components/form-uh/form-uh.component';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-tabela-mapa-diario',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tabela-mapa-diario.component.html',
  styles: `
    .color-box { 
      width: 1.2rem; 
      height: 1.2rem; 
      margin: 0;
      border: 1px solid #000;
    }
  `
})
export class TabelaMapaDiarioComponent implements OnDestroy {
  mapaSelecionado?: MapaDispV1Model[] = [];
  listaDatas: Date[] = [];
  $unsubscribe = new Subject<void>();
  listaUhMapaDiario: DetalhesTipoUhV1Model[] = [];
  listaUhBD: TipoUhV1Model[] = [];

  constructor(
    private comunicacaoEntreComponentes: MapaDiarioComunicacaoEntreComponentesV1Service,
    private comunicacaoComApiTarifario: ComunicacaoApiTarifarioV1Service,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.comunicacaoEntreComponentes.mapaSelecionado
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(mapa => {
        this.mapaSelecionado = mapa;
        this.obterListaUh(mapa[0]);
        this.listaDatas = mapa.map(d => d.data);
        this.getListaUhBD();
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  /**
   * Obtém a lista de UHs do mapa diário
   * @param item O item do mapa diário
   */
  obterListaUh(item: MapaDispV1Model) {
    // Limpa a lista de UHs
    this.listaUhMapaDiario = [];
    // Itera sobre o mapa diário e adiciona as UHs à lista
    item.mapaDiario?.map(m => this.listaUhMapaDiario.push(m))
    this.listaUhMapaDiario = this.listaUhMapaDiario.sort((a, b) => a.nomeUH!.localeCompare(b.nomeUH));

    this.listaUhMapaDiario.forEach(e => {
      e.hotel = this.mapaSelecionado?.find(f => f.mapaDiario.find(d => d.idUH == e.idUH))?.hotel;
      e.idHotel = this.mapaSelecionado?.find(f => f.mapaDiario.find(d => d.idUH == e.idUH))?.idHotel;
    })
  }

  /**
   * Retorna a disponibilidade da UH na data e no índice informados
   * @param uh A UH
   * @param data A data
   * @param indice O índice da data na lista de datas
   * @returns A disponibilidade da UH na data e no ndice informados
   */
  definindoDisponibilidade(uh: DetalhesTipoUhV1Model, indice: number): number | undefined {
    const uhDisponivel = this.mapaSelecionado![indice].mapaDiario.find(
      (d: DetalhesTipoUhV1Model) => d.idUH == uh.idUH
    )!

    // Retorna a disponibilidade
    return uhDisponivel.disponivel
  }

  /**
   * Retorna o total de disponibilidade para o dia e o índice informados
   * @param indice O índice da data na lista de datas
   * @returns O total de disponibilidade para o dia e o índice informados
   */
  total(indice: number): number {
    // Retorna o total de disponibilidade para o dia e o índice informados
    return this.mapaSelecionado![indice].totalDispDia;
  }

  /**
   * Define o background da célula com base no valor informado
   * 
   * @param valor O valor a ser avaliado
   * @param idUH O ID da UH
   * @returns O background definido
   */
  definindoBackground(valor: number, idUH: number): string {
    let bgDefinido = '';
    const totalQuartos = this.listaUhBD.find(uh => uh.idTipoUh == idUH)?.totalQuartos;

    // Se o valor for menor que 0, define o background como vermelho claro
    if (valor < 0) {
      bgDefinido = 'bg-vermelho';
    } else {
      const porcentagem = (valor / totalQuartos!) * 100;
      /**
       * Define o background com base na porcentagem
       * - Porcentagem maior que 50%: Azul escuro
       * - Porcentagem entre 35% e 50%: Azul claro
       * - Porcentagem entre 20% e 35%: Cinza
       * - Porcentagem menor que 20%: Laranja
       */
      if (porcentagem >= 50) {
        bgDefinido = 'bg-azul-escuro';
      } else if (porcentagem >= 35) {
        bgDefinido = 'bg-azul-claro';
      } else if (porcentagem >= 20) {
        bgDefinido = 'bg-cinza';
      } else {
        bgDefinido = 'bg-laranja';
      }
    }

    return bgDefinido;
  }

  /**
   * Ajusta o nome da UH para que ele esteja no formato correto
   * 
   * Se o nome da UH incluir 'APART-HOTEL ', remove-o para que o nome esteja 
   * no formato correto
   * 
   * @param nome O nome da UH
   * @returns O nome da UH ajustado
   */
  ajustarNomeUH(nome: string): string {
    if (nome.includes('APART-HOTEL ')) {
      nome = nome.replace('APART-HOTEL ', '');
    }

    return nome
  }

  /**
   * Obtém a lista de UHs do banco de dados
   * @returns {Promise<void>}
   */
  async getListaUhBD(): Promise<void> {
    try {
      this.listaUhBD = [];
      // Obtém a lista de UHs do banco de dados
      const resultado = await lastValueFrom(this.comunicacaoComApiTarifario.getListaUh());

      if (resultado.success) {
        // Se a lista de UHs for obtida com sucesso, atualiza a lista de UHs do componente
        this.listaUhBD = resultado.data;
        this.verificarEAdicionarUh(
          this.listaUhMapaDiario,
          this.listaUhBD
        )
      }
    } catch (error) {
      // Se ocorrer um erro, lança um erro para o console
      console.error(error);
    }
  }


  // Função para comparar as listas e exibir alerta
  verificarEAdicionarUh(novasUhs: DetalhesTipoUhV1Model[], uhsSalvas: TipoUhV1Model[]) {
    // Lista de UHs que não estão na base de dados
    const uhsNaoSalvas = novasUhs.filter(novaUh =>
      !uhsSalvas.some(uhSalva => uhSalva.idTipoUh === novaUh.idUH)
    );

    if (uhsNaoSalvas.length > 0) {
      // Exibe alerta para cada UH que não está na base de dados
      uhsNaoSalvas.forEach(uhNaoSalva => {
        Swal.fire({
          title: 'Nova Unidade Hoteleira Detectada',
          text: `A unidade "${uhNaoSalva.nomeUH}" não está cadastrada no sistema. Deseja adicioná-la?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, adicionar',
          cancelButtonText: 'Não'
        }).then((result) => {
          if (result.isConfirmed) {
            // Lógica para adicionar UH na base de dados
            this.abrirModalAdicionarUhNaBase(uhNaoSalva);
          }
        });
      });
    }
  }

  /**
   * Abre o modal para adicionar uma nova Unidade Hoteleira à base de dados
   * @param uh A UH que será adicionada
   */
  abrirModalAdicionarUhNaBase(uh: DetalhesTipoUhV1Model) {
    const novaUh = new TipoUhV1Model();
    novaUh.idTipoUh = uh.idUH;
    novaUh.nomeTipoUh = uh.nomeUH;
    novaUh.nomeHotel = uh.hotel;
    novaUh.idHotel = uh.idHotel;

    // Abre o modal com o formulário de criação de UH
    const modalRef = this.modalService.open(
      FormUhComponent,
      {
        size: 'sm',
        centered: true,
        keyboard: false,
        modalDialogClass: 'modal-dialog',
        backdrop: 'static'
      }
    );

    // Atribui a UH selecionada ao componente do modal
    modalRef.componentInstance.uhSelecionado = novaUh;
    modalRef.componentInstance.isAcessandoPeloMapaDiario = true;

    // Inscreve-se para quando o modal for fechado
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        // Se o resultado for sucesso, atualiza a lista de UHs
        this.getListaUhBD();
      } else {
        // Se não, mostra um toast informando o erro e abre o modal de cadastro, novamente.
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          'error'
        )
        this.abrirModalAdicionarUhNaBase(uh);
      }
    });
  }
}