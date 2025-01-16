import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicacaoApiTarifarioV1Service } from '../services/comunicacao-api-tarifario-v1.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TarifarioComunicacaoEntreComponentesV1Service } from '../services/tarifario-comunicacao-entre-componentes-v1.service';
import { TabelaTarifasUhComponent } from './components/tabela-tarifas-uh/tabela-tarifas-uh.component';
import { ListaUhPorTarifarioComponent } from './components/lista-uh-por-tarifario/lista-uh-por-tarifario.component';
import { FormTarifarioComponent } from 'src/app/routes/reservas/tarifario-gestao/components/form-tarifario/form-tarifario.component';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import { TarifarioAgrupadoV1Interface } from '../models/tarifario-agrupado-v1.interface';
import { TarifarioV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tarifario-v1.model';
import { TarifasV1Model } from 'src/app/routes/reservas/tarifario-gestao/models/tarifas-v1.model';

@Component({
  selector: 'app-tarifario',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    ListaUhPorTarifarioComponent,
    TabelaTarifasUhComponent,
    NgbTooltipModule
  ],
  templateUrl: './tarifario.component.html',
  styles: ``
})
export class TarifarioComponent implements OnInit, OnDestroy {
  // variáveis de ambiente
  dtHoje = new Date()
  listaTarifarios: TarifarioV1Model[] = [];
  tarifarioSelecionado: TarifarioV1Model | undefined = undefined
  idTarifarioUrl: string;
  isUhSelecionado: boolean = false;
  $unsubscribe = new Subject<void>()

  constructor(
    private comunicacaoApi: ComunicacaoApiTarifarioV1Service,
    private loaderService: LoaderService,
    private comunicacaoEntreComponentes: TarifarioComunicacaoEntreComponentesV1Service,
    private router: Router,
    private mensagemToastr: MensagemToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {
    this.comunicacaoEntreComponentes.tarifarioSelecionado.pipe(takeUntil(this.$unsubscribe))
      .subscribe((tarifario) => {
        this.tarifarioSelecionado = tarifario
      });

    this.comunicacaoEntreComponentes.isUhSelecionado.pipe(takeUntil(this.$unsubscribe))
      .subscribe((isUhSelecionado) => {
        this.isUhSelecionado = isUhSelecionado
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
    this.comunicacaoEntreComponentes.reiniciarVariaveis();
  }

  ngOnInit(): void {
    this.idTarifarioUrl = this.activatedRoute.snapshot.params['idTarifario'];
    this.getTarifario(this.idTarifarioUrl);
  }

  /**
   * Recupera e processa os dados de tarifa da API.
   * Inicia um carregador, busca os dados de tarifa, filtra tarifas ativas,
   * e lida com quaisquer erros potenciais.
   *
   * @returns {Promise<void>}
   */
  async getTarifario(idTarifario?: string): Promise<void> {
    this.loaderService.startLoader();
    try {

      // Busca todos os dados de tarifa da API
      const resultado = await lastValueFrom(this.comunicacaoApi.getTarifarioAdtur());

      // Se a chamada for bem-sucedida, filtra e define tarifas disponíveis
      if (resultado.success) {
        if (idTarifario) {
          this.listaTarifarios = resultado.data;
          this.selecionarEVisualizarTarifario(idTarifario);
        } else {
          this.filtrarEDefinirOsTarifariosDisponiveis(resultado.data);
        }
      }
    } catch (error) {
      // Lida com erros HTTP usando o TratamentoErrosHttpErrorResponseService
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.error('Um erro inesperado ocorreu:', error);
      }
    } finally {
      // Certifica-se de que o carregador seja parado independentemente do sucesso ou fracasso
      this.loaderService.stopLoader();
    }
  }

  /**
   * Filtra e define os tarifários ativos disponíveis.
   *
   * @param {TarifarioV1Model[]} tarifario - Array de modelos de tarifário a serem filtrados.
   */
  filtrarEDefinirOsTarifariosDisponiveis(tarifario: TarifarioV1Model[]) {
    // Filtra os tarifários para incluir apenas aqueles que estão ativos
    const tarifariosAtivos = tarifario.filter((tarifario) => tarifario.actived);

    // Define a lista de tarifários para os tarifários ativos filtrados
    this.listaTarifarios = tarifariosAtivos;

    if (this.listaTarifarios.length === 1) {
      this.selecionarEVisualizarTarifario(this.listaTarifarios[0]._id)
    }
  }

  /**
   * Agrupa as tarifas do tarifário selecionado por tipo de unidade hoteleira.
   *
   * @returns {TarifarioAgrupadoV1Interface[]} - Array de objetos com as tarifas agrupadas por tipo de unidade hoteleira.
   */
  agruparTarifasPorTipoUh(): TarifarioAgrupadoV1Interface[] {
    const tarifasAgrupadas = this.tarifarioSelecionado!.tarifas.reduce(
      (acc: any, tarifa: TarifasV1Model) => {
        const uhId = tarifa.tipoUh?._id!;
        // Verifica se a unidade hoteleira já existe no objeto de agrupamento
        if (!acc[uhId]) {
          // Se não existir, cria um novo objeto com a unidade hoteleira e um array de tarifas
          acc[uhId] = {
            tipoUh: tarifa.tipoUh,
            tarifas: []
          };
        }
        // Adiciona a tarifa ao array de tarifas da unidade hoteleira
        acc[uhId].tarifas.push({
          valorPensaoCafeManha: tarifa.valorPensaoCafeManha,
          valorMeiaPensaoAlmoco: tarifa.valorMeiaPensaoAlmoco,
          isPadrao: tarifa.isPadrao,
          isDomingoAQuinta: tarifa.isDomingoAQuinta,
          isQuintaADomingo: tarifa.isQuintaADomingo,
          isAltaTemporadaEFeriados: tarifa.isAltaTemporadaEFeriados,
          _id: tarifa._id
        });

        // Retorna o objeto de agrupamento
        return acc;
      }, {});

    // Converte o objeto de agrupamento em um array de objetos
    const tarifasAgrupadasArray: TarifarioAgrupadoV1Interface[] = Object.values(tarifasAgrupadas);

    // Para o Loader
    this.loaderService.stopLoader();

    return tarifasAgrupadasArray;
  }

  /**
   * Seleciona um tarifário e visualiza seus detalhes.
   *
   * @param {string} id - O ID do tarifário a ser selecionado e visualizado.
   *
   * @description
   * Inicia o loader para indicar processamento, encontra o tarifário pelo seu ID na lista
   * de tarifários e o define como o tarifário selecionado e agrupa as tarifas do tarifário
   * selecionado por tipo de unidade hoteleira.
   */
  selecionarEVisualizarTarifario(id: string) {
    // Inicia o loader para indicar processamento
    this.loaderService.startLoader();

    // Encontra o tarifário pelo seu ID na lista de tarifários
    // Define o tarifário encontrado como o tarifário selecionado
    this.tarifarioSelecionado = this.listaTarifarios.find(
      (tarifario) => tarifario._id === id
    );

    // Emite o tarifário selecionado para outros componentes
    this.comunicacaoEntreComponentes.emitirTarifarioSelecionado(this.tarifarioSelecionado!);

    // Agrupa as tarifas do tarifário selecionado por tipo de unidade hoteleira
    // Emite as tarifas agrupadas para outros componentes
    this.comunicacaoEntreComponentes.emitirTarifarioAgrupadoPorUh(
      this.agruparTarifasPorTipoUh()
    );
  }

  /**
   * Volta a lista de tarifários
   * @description
   * Apaga o tarifario selecionado e a lista de tarifas agrupadas
   * e volta a lista de tarifários
   */
  voltarAListaDosTarifarios() {
    this.tarifarioSelecionado = undefined;
    this.comunicacaoEntreComponentes.emitirTarifarioAgrupadoPorUh([]);
    this.comunicacaoEntreComponentes.emitirTarifarioSelecionado(undefined);
  }

  voltarAListaDeUh() {
    this.comunicacaoEntreComponentes.emitirIsUhSelecionado(false);
  }

  /**
   * Abre um modal para cadastrar um novo tarifário
   *
   * @description
   * Abre um modal com o componente FormTarifarioComponent, que permite
   * cadastrar um novo tarifário. O modal tem um tamanho definido como 'md',
   * é centralizado na tela e tem um backdrop estático. O resultado do
   * cadastro do tarifário é exibido em uma mensagem de sucesso ou erro
   * e, se o resultado for positivo, redireciona para a página de cadastro
   * de tarifas.
   */
  abrirModalCadastrarTarifario() {
    const modalRef = this.modalService.open(
      FormTarifarioComponent,
      {
        size: 'md',
        centered: true,
        backdrop: 'static',
        modalDialogClass: "modal-dialog",
      }
    )

    modalRef.closed.subscribe(
      (resultado: ResultV1Model) => {
        /**
       * Exibe uma mensagem de sucesso ou erro com base no resultado da API.
       * Se o resultado for positivo, redireciona para a página de cadastro de tarifas.
       */
        this.mensagemToastr.show(
          resultado!.message,
          resultado!.titulo,
          resultado!.success ? "success" : "info"
        )

        if (resultado!.success) {
          this.router.navigate(['/reservas/gestao-tarifario/tarifas/' + resultado!.data._id])
        }
      }
    )
  }

  /**
   * Volta para a página de gestão de tarifários
   */
  voltarAGestaoTarifarios() {
    this.router.navigate(['/reservas/gestao-tarifario'])
  }
} 
