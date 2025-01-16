import { Component, inject, OnInit } from '@angular/core';
import { MapMargemOcupacaoV1Model } from '../table-row-margem-ocupacao/table-row-margem-ocupacao.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MapMargemDescontoV1Model } from '../table-row-margem-desconto/table-row-margem-desconto.component';

@Component({
  selector: 'app-form-margem',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-margem.component.html',
  styles: ``
})
export class FormMargemComponent implements OnInit {
  dataSelecionada: MapMargemOcupacaoV1Model | MapMargemDescontoV1Model;
  modalAtivo = inject(NgbActiveModal);
  margemDefinida: number;
  tipoMargemSendoDefinida: 'ocupacao' | 'desconto';

  /**
   * Verifica se a data selecionada tem valores válidos para a margem,
   * seja ela de ocupação ou desconto. Se sim, define o valor da
   * margem a ser definida.
   */
  ngOnInit(): void {
    if (this.dataSelecionada) {
      if (this.tipoMargemSendoDefinida == 'ocupacao') {
        try {
          // Verifica se a data selecionada é uma margem de ocupação
          const margem = this.dataSelecionada as MapMargemOcupacaoV1Model;

          // Define o valor da margem a ser definida, seja ela padrão
          // ou diária.
          this.margemDefinida = this.dataSelecionada?.isPadrao ?
            margem.margemOcupacaoPadrao.margemOcupacao :
            margem.margemOcupacaoDiario.margemOcupacao;
        } catch (error) {
          // Se houver um erro, sai da função.
          return;
        }
      } else {
        try {
          // Verifica se a data selecionada é uma margem de desconto
          const margem = this.dataSelecionada as MapMargemDescontoV1Model;

          // Define o valor da margem a ser definida, seja ela padrão
          // ou diária.
          this.margemDefinida = this.dataSelecionada?.isPadrao ?
            margem.margemDescontoPadrao.margemDesconto :
            margem.margemDescontoDiario.margemDesconto;
        } catch (error) {
          // Se houver um erro, sai da função.
          return;
        }
      }
    }
  }

  /**
   * Fecha o modal sem gravar a 'Margem de Ocupacao'.
   * Retorna um objeto ResultV1Model com o sucesso como false,
   * titulo como 'Definição de margem cancelada', mensagem vazia,
   * data nula e error nulo.
   */
  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Definição de margem cancelada',
        '',
        null,
        null
      )
    );
  }

  /**
   * Exibe um alerta de confirmação para remover a margem.
   * Se confirmado, fecha o modal e retorna o resultado.
   *
   * @returns {void}
   */
  alertaRemoverMargem(): void {
    Swal.fire({
      title: `Tem certeza que deseja remover a margem?`,
      text: `Caso seja removida, será aplicada a margem padrão definida.`,
      icon: `warning`,
      backdrop: `rgba(73,80,87,0.50)`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Remover'
    }).then(
      (result) => {
        if (result.isConfirmed) {
          let _id = '';

          // Verifica qual tipo de margem está sendo definida
          switch (this.tipoMargemSendoDefinida) {
            // Recupera o ID da margem de desconto diária a ser removida
            case 'desconto':
              const margemDescontoDiario = this.dataSelecionada as MapMargemDescontoV1Model
              _id = margemDescontoDiario.margemDescontoDiario._id
              break;
            // Recupera o ID da margem de ocupacao diária a ser removida
            case 'ocupacao':
              const margemOcupacaoDiario = this.dataSelecionada as MapMargemOcupacaoV1Model
              _id = margemOcupacaoDiario.margemOcupacaoDiario._id;
              break;
          }

          // Fecha o modal e passa o resultado indicando remoção de margem
          this.modalAtivo.close(
            new ResultV1Model(
              false,
              'Remover margem',
              '',
              _id,
              null
            )
          );
        }
      }
    );
  }


  /**
   * Fecha o modal e passa o resultado da inclusão de uma nova 'Margem de Ocupação'
   * ou 'Margem de Desconto'.
   *
   * @returns {ResultV1Model} O resultado da inclusão da margem.
   */
  postNovaMargem() {
    this.modalAtivo.close(
      new ResultV1Model(
        true, // sucesso
        'Nova margem', // título
        this.tipoMargemSendoDefinida, // tipo de margem (ocupacao ou desconto)
        {
          /**
           * Data da margem a ser incluída.
           */
          data: new Date(this.dataSelecionada.data),
          /**
           * Valor da margem a ser incluída.
           */
          margem: this.margemDefinida
        }, // data
        null // error
      )
    );
  }

  /**
   * Obtém o título apropriado para o modal de margem com base no tipo de margem sendo definida
   * e se a margem é padrão ou não.
   *
   * @returns {string} O título do modal.
   */
  get titulo(): string {
    switch (this.tipoMargemSendoDefinida) {
      case 'desconto':
        // Retorna o título para margem de desconto
        return !this.dataSelecionada.isPadrao ? 'Editando Margem de Desconto' : 'Nova Margem de Desconto';
      case 'ocupacao':
        // Retorna o título para margem de ocupação
        return !this.dataSelecionada.isPadrao ? 'Editando Margem de Ocupação' : 'Nova Margem de Ocupação';
    }
  }
}
