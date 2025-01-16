import { CommonModule } from '@angular/common';
import { Component, inject, Output, output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from './custom-datepicker-i18n.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-datepicker-range',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
  ],
  providers: [
    I18n,
    {
      provide: NgbDatepickerI18n,
      useClass: CustomDatepickerI18n
    }
  ],
  templateUrl: './datepicker-range.component.html',
  styles: `
  .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range,
    .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `
})
export class DatepickerRangeComponent {
  // variáveis de ambiente
  calendar = inject(NgbCalendar);
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  dtInicio: Date;
  dtFim: Date;

  // variáveis de comunicação
  static datasSelecionadas = new Subject<{ fromDate: Date; toDate: Date }>();


  /**
   * Método chamado quando o usuário seleciona uma data no calendário.
   * @param date A data selecionada pelo usuário.
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      // Caso o usuário ainda não tenha selecionado nenhuma data, a data selecionada
      // agora se tornará a data de início do range.
      this.fromDate = date;
    }
    else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      // Caso o usuário tenha selecionado a data de início do range e
      // agora esteja selecionando a data de fim do range, a data selecionada
      // agora se tornará a data de fim do range.
      this.toDate = date;

      DatepickerRangeComponent.datasSelecionadas.next(
        this.converterDatas({ fromDate: this.fromDate, toDate: this.toDate })
      );
    }
    else {
      // Caso contrário, o usuário está selecionando uma nova data de início do range,
      // então a data de fim do range deve ser resetada e a nova data de início do range
      // deve ser armazenada.
      this.toDate = null;
      this.fromDate = date;
    }
  }

  /**
   * Verifica se a data está sendo pairada, ou seja, o usuário está movendo o mouse sobre a data
   * e ainda não clicou nela.
   * @param date A data a ser verificada.
   * @returns True se a data está pairada, false caso contrário.
   */
  isHovered(date: NgbDate): boolean | null {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  /**
   * Verifica se uma data especificada está dentro do intervalo de datas selecionado.
   * 
   * @param date A data a ser verificada.
   * @returns True se a data estiver entre fromDate e toDate, false caso contrário.
   */
  isInside(date: NgbDate): boolean | null {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * Verifica se a data especificada é a data de início do range (fromDate),
   * a data de fim do range (toDate) ou se está dentro do range.
   * @param date A data a ser verificada.
   * @returns True se a data for a data de início do range, a data de fim do range ou se estiver dentro do range, false caso contrário.
   */
  isRange(date: NgbDate): boolean | null {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   * Define as datas de início e fim com base na faixa de datas selecionada.
   * 
   * @param datas Um objeto contendo fromDate e toDate, que são as datas de início e fim da faixa.
   */
  converterDatas(datas: { fromDate: NgbDate, toDate: NgbDate }) {
    this.dtInicio = new Date(datas.fromDate.year, datas.fromDate.month - 1, datas.fromDate.day);
    this.dtFim = new Date(datas.toDate.year, datas.toDate.month - 1, datas.toDate.day);
    return {
      fromDate: this.dtInicio,
      toDate: this.dtFim
    };
  }
}
