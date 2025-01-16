import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { LimiteDiariasV1Model } from 'src/app/routes/reservas/minimo-diarias/models/limite-diarias-v1-model';
import { MapLimitesDiariasModel } from '../../../models/map-limites-diarias';

@Component({
  selector: 'app-form-limite-diaria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './form-limite-diaria.component.html',
  styles: ``
})
export class FormLimiteDiariaComponent implements OnInit {
  /**Variáveis de Ambiente */
  minimoDiarias?: number;
  maximoDiarias?: number;
  dataAAplicarOLimite: string;

  /**Variáveis a serem preenchidas na chamada do modal*/
  limiteDiaria!: MapLimitesDiariasModel;
  tipo: 'minimo' | 'maximo';

  constructor(
    private modalAtivo: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.definicoesIniciais();
  }

  /**
   * Função responsável por definir as configurações iniciais do formulário.
   * Essa função é chamada assim que o componente é inicializado.
   */
  definicoesIniciais() {
    // Define a data que o limite de diária será aplicado
    this.dataAAplicarOLimite = this.limiteDiaria.data;
    this.minimoDiarias = this.limiteDiaria.limite?.minimo;
    this.maximoDiarias = this.limiteDiaria.limite?.maximo;
  }

  /**
   * Retorna o título do formulário de acordo com o tipo de limite de diária a ser definido.
   * @returns string
   */
  get titulo(): string {
    switch (this.tipo) {
      case 'minimo':
        // Definição de Mínimo de Diária
        return 'Definição do Mínimo de Diária';
      case 'maximo':
        // Definição de M ximo de Diária
        return 'Definição do Máximo de Diária';
    }
  }

  fecharModal() {
    this.modalAtivo.close(
      new ResultV1Model(
        false,
        'Definição de limite de diária cancelada',
        '',
        null,
        null
      )
    )
  }

  /**
   * Função responsável por gravar um novo limite de diária.
   * Ela fecha o modal e retorna um objeto ResultV1Model com o sucesso como true,
   * título como 'Definição de limite de diária realizada com sucesso', mensagem vazia,
   * data com o objeto { minimoDiarias, maximoDiarias, data } e error nulo.
   */
  novoLimiteDiaria() {
    const limite: LimiteDiariasV1Model = {
      _id: this.limiteDiaria?.limite?._id,
      _idAccount: this.limiteDiaria?.limite?._idAccount,
      data: this.dataAAplicarOLimite,
      minimo: this.minimoDiarias,
      maximo: this.maximoDiarias
    }
    this.modalAtivo.close(
      new ResultV1Model(
        true,
        'Definição de limite de diária realizada com sucesso',
        '',
        limite,
        null
      )
    )
  }
}
