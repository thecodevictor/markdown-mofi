import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtro-periodo',
  templateUrl: './filtro-periodo.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class FiltroPeriodoComponent {
  dtInicio!: Date;
  dataSelecionada = new EventEmitter<Date>();

  constructor(
    private modalAtivo: NgbActiveModal
  ) {
  }

  buscarPeriodo() {
    this.dataSelecionada.emit(new Date(new Date(this.dtInicio).setUTCHours(0, 0, 0, 0)))
    this.fecharModal();
  }

  fecharModal() {
    this.modalAtivo.close();
  }
}
