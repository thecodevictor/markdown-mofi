import { Injectable } from '@angular/core';
import { TrabalhandoDatasService } from './trabalhando-datas.service';

@Injectable({
  providedIn: 'root'
})
export class FuncoesUteisService {

  constructor(
    private trabalhandoDatasService: TrabalhandoDatasService
  ) {}

  /**
   * Função utilizada para tratar uma data e retornar um período
   * @param periodo recebe o período que será formatado
   * @returns retorna uma string do período de apuração no formato yyyymm 
   */
  tratandoPeriodo(periodo: Date, formatoDesejado: string): string {
    periodo = this.trabalhandoDatasService.criandoNewDateUTC0(periodo)
    let dia = periodo.getUTCDate();
    let mes = periodo.getUTCMonth() + 1;
    let ano = periodo.getUTCFullYear();
    let mesStr: string;

    if (mes < 10) {
      mesStr = `0${mes}`;
    } else {
      mesStr = `${mes}`;
    }

    switch(formatoDesejado){
      case 'yyyymm':
        return `${ano}${mesStr}`;
      case 'dd/mm/yyyy':
        return `${dia}/${mesStr}/${ano}`
      default:
        return '';
    }
  }

  /**
   * Função utilizada para formatar o período yyyymm em MM/yyyy
   * @param periodo o periodo (em formato inicial yyyymm) a ser formatado
   * @returns a string com o periodo formatado, para a visualização
   */
  formatandoPeriodoApuracao(periodo: string | number) {
    if(typeof(periodo) === 'number'){
      periodo = periodo.toString();
    }
    switch (periodo.slice(4, 6)) {
      case '01':
        return `Janeiro/${periodo.substring(0, 4)}`
      case '02':
        return `Fevereiro/${periodo.substring(0, 4)}`
      case '03':
        return `Março/${periodo.substring(0, 4)}`
      case '04':
        return `Abril/${periodo.substring(0, 4)}`
      case '05':
        return `Maio/${periodo.substring(0, 4)}`
      case '06':
        return `Junho/${periodo.substring(0, 4)}`
      case '07':
        return `Julho/${periodo.substring(0, 4)}`
      case '08':
        return `Agosto/${periodo.substring(0, 4)}`
      case '09':
        return `Setembro/${periodo.substring(0, 4)}`
      case '10':
        return `Outubro/${periodo.substring(0, 4)}`
      case '11':
        return `Novembro/${periodo.substring(0, 4)}`
      case '12':
        return `Dezembro/${periodo.substring(0, 4)}`
      default:
        return 'Data inválida'
    }
  }
}
