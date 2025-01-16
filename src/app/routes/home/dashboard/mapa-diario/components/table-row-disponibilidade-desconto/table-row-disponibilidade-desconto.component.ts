import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComunicacaoApiDisponibilidadeDescontoV1Service } from 'src/app/routes/reservas/margem-e-desconto/disponibilidade-desconto/services/comunicacao-api-disponibilidade-desconto-v1.service';
import { MapDispDescTRV1Model } from '../../../models/map-disp-desc-trmodel';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { lastValueFrom } from 'rxjs';
import { DisponibilidadeDescontoV1Model } from 'src/app/routes/reservas/margem-e-desconto/disponibilidade-desconto/models/disponibilidade-desconto-v1.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMargensDisponDescComponent } from 'src/app/routes/reservas/margem-e-desconto/disponibilidade-desconto/components/modal-margens-dispon-desc/modal-margens-dispon-desc.component';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';
import Swal from 'sweetalert2';
import { FormPeriodoComponent } from 'src/app/routes/reservas/margem-e-desconto/disponibilidade-desconto/components/form-periodo/form-periodo.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-table-row-disponibilidade-desconto',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-disponibilidade-desconto.component.html',
  styles: ``
})
export class TableRowDisponibilidadeDescontoComponent implements OnChanges {
  @Input() listaDatas: string[] = [];
  mapaDisponibilidadeDesconto: MapDispDescTRV1Model[] = [];
  listaDisponibilidadesDescontos: DisponibilidadeDescontoV1Model[] = [];

  constructor(
    private comunicacaoComApi: ComunicacaoApiDisponibilidadeDescontoV1Service,
    private modalService: NgbModal,
    private mensagemToastrService: MensagemToastrService,
    private loaderService: LoaderService
  ) { }

  ngOnChanges(): void {
    this.getDisponibilidadeDesconto();
  }

  /**
   * Busca as disponibilidades e descontos para todas as datas,
   * e formata os resultados para exibição na tabela.
   * 
   * Se a solicitação for bem-sucedida, atualiza o array
   * `mapaDisponibilidadeDesconto` com os dados formatados.
   * Caso ocorra um erro, lida com ele.
   */
  async getDisponibilidadeDesconto(dataDefinindoPeriodo?: DisponibilidadeDescontoV1Model, isGetDefinindoMargens?: boolean) {
    if (dataDefinindoPeriodo || isGetDefinindoMargens) {
      this.loaderService.startLoader();
    }

    try {
      const resultado = await lastValueFrom(this.comunicacaoComApi.getAllDisponDesconto()) as ResultV1Model;
      if (resultado.success) {
        this.listaDisponibilidadesDescontos = resultado.data;
        this.formatarDados();
        if (dataDefinindoPeriodo) {
          setTimeout(() => {
            this.abrirModalDefinindoMargens(dataDefinindoPeriodo);
          }, 500);
        }
      }

      if (dataDefinindoPeriodo || isGetDefinindoMargens) {
        this.loaderService.stopLoader();
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Lida com erros HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        // Loga outros erros
        console.log('error')
        console.log(error)
      }

      if (dataDefinindoPeriodo || isGetDefinindoMargens) {
        this.loaderService.stopLoader();
      }
    }
  }


  /**
   * Retorna o estilo de background para a célula da tabela,
   * com base na disponibilidade e desconto para a data atual.
   * 
   * @param dia string - Data no formato 'yyyy-MM-dd' para a qual
   *              se deseja definir o estilo de background.
   * @returns string - Estilo de background para a célula da tabela.
   */
  definirBg(dia: string): string {
    let bg = 'bg-body-secondary'

    if (this.mapaDisponibilidadeDesconto.length > 0) {
      // Procura a disponibilidade e desconto para a data especificada
      const disponibilidadeDesconto = this.mapaDisponibilidadeDesconto.find(
        (e: MapDispDescTRV1Model) => e.data === dia
      );

      if (disponibilidadeDesconto?.dispDesc) {
        bg = 'bg-azul-escuro'
      }
    }
    // Retorna 'bg-azul-escuro' se houver disponibilidade e desconto, caso contrário, 'bg-body-secondary'
    return bg;
  }

  /**
   * Cria um mapa de disponibilidade e desconto por data,
   * considerando as datas informadas e as disponibilidades e descontos
   * encontrados na API.
   */
  formatarDados() {
    this.mapaDisponibilidadeDesconto = [];
    this.listaDatas.forEach((dia: string) => {
      // Procura a disponibilidade e desconto para a data atual
      const disponibilidadeDesconto = this.listaDisponibilidadesDescontos.find((e: DisponibilidadeDescontoV1Model) => {
        const dataInicialStr = new Date(e.dtInicio).toISOString().split('T')[0];
        const dataFinalStr = new Date(e.dtFim).toISOString().split('T')[0];
        return dia <= dataFinalStr && dia >= dataInicialStr;
      });

      // Adiciona a informa o ao mapa de disponibilidade e desconto
      if (disponibilidadeDesconto) {
        this.mapaDisponibilidadeDesconto.push({
          data: dia,
          dispDesc: disponibilidadeDesconto
        });
      } else {
        this.mapaDisponibilidadeDesconto.push({
          data: dia,
          dispDesc: undefined
        });
      }
    });
  }

  /**
   * Verifica se o dia passado por parâmetro tem um período de disponibilidade
   * e desconto definido. Se sim, abre o modal de edição de margens. Caso
   * contrário, abre um diálogo de confirmação para adicionar um novo período.
   *
   * @param dia Data do dia que o usuário deseja adicionar/alterar a disponibilidade
   *            e desconto.
   */
  definirModalASerAberto(dia: string) {
    const disponibilidade = this.mapaDisponibilidadeDesconto.find(
      (e: MapDispDescTRV1Model) => e.data === dia
    );

    const isNovoPeriodo = disponibilidade?.dispDesc ? false : true;

    if (isNovoPeriodo) {
      // Se for um novo período, abre um diálogo de confirmação para adicionar
      // o novo período.
      this.adicionarNovoPeriodoDisponibilidadeDesconto(dia);
    } else {
      // Se o período já existe, abre o modal de edição de margens.
      this.abrirModalDefinindoMargens(disponibilidade?.dispDesc!);
    }
  }

  /**
   * Abre um diálogo de confirmação para adicionar um novo período. 
   * Se confirmado, navega para a página do dashboard e, em seguida, 
   * redireciona para a página de dispondescontos após um curto atraso.
   */
  adicionarNovoPeriodoDisponibilidadeDesconto(dia: string) {
    Swal.fire({
      title: "Deseja cadastrar um novo período?",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#2cb57e",
      showDenyButton: true,
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.abrirModalDefinirPeriodo(dia);
      }
    });
  }

  /**
   * Visualiza as informações de disponibilidade de desconto TR para o dia
   * selecionado.
   *
   * @param item O item do mapa que contém as informações de disponibilidade de
   * desconto TR.
   */
  abrirModalDefinindoMargens(dispDesc: DisponibilidadeDescontoV1Model) {
    // Abre o modal com as informações de disponibilidade de desconto TR
    const modalRef = this.modalService.open(
      ModalMargensDisponDescComponent,
      {
        keyboard: false,
        centered: true,
        size: 'md',
        modalDialogClass: "modal-dialog"
      }
    );
    modalRef.componentInstance.dadoAAtualizar = dispDesc;

    /**
     * Função chamada quando o modal é fechado.
     * Caso o resultado seja sucesso, chama a função getDisponDesconto() para
     * atualizar a lista de disponibilidades.
     * @param resultado Resultado da ação realizada no modal.
     */
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      this.getDisponibilidadeDesconto(undefined, true);
      this.mensagemToastrService.show(
        resultado.titulo,
        resultado.message,
        resultado.success
          ? 'success'
          : (resultado.titulo?.includes('fechada')
            ? 'info'
            : 'error'
          )
      );
    });
  }

  /**
   * Abre o modal para definir o período de disponibilidade do desconto.
   * Caso o tipo seja 'novo', o modal começa em branco. Caso seja 'editando',
   * o modal já vem preenchido com os dados do período passado como parâmetro.
   * @param tipo Tipo de ação a ser realizada. 'novo' para criar um novo período,
   * 'editando' para editar um período já existente.
   * @param dadoAAtualizar Período de disponibilidade do desconto a ser editado.
   * Caso seja 'novo', este parâmetro é opcional.
   */
  abrirModalDefinirPeriodo(dia: string) {
    const modalRef = this.modalService.open(
      FormPeriodoComponent,
      {
        keyboard: false,
        centered: true,
        size: 'sm',
        modalDialogClass: "modal-dialog"
      }
    );

    modalRef.componentInstance.tipo = 'novo';
    modalRef.componentInstance.dataInicio = dia;

    /**
     * Função chamada quando o modal é fechado.
     * Caso o resultado seja sucesso, chama a função getDisponDesconto() para
     * atualizar a lista de disponibilidades. Além disso, chama a função
     * abrirModalDefinirMargens() para definir as margens do desconto.
     * @param resultado Resultado da ação realizada no modal.
     */
    modalRef.closed.subscribe((resultado: ResultV1Model) => {
      if (resultado.success) {
        this.getDisponibilidadeDesconto(resultado.data);
      }

      this.mensagemToastrService.show(
        resultado.titulo,
        resultado.message,
        resultado.success
          ? 'success'
          : (resultado.titulo.includes('cancelada')
            ? 'info'
            : 'error'
          )
      );
    });
  }
}
