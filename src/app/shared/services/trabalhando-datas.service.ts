import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrabalhandoDatasService {

  constructor() { }

  /**
   * 
   * @param date dado que será utilizado para criar a nova data
   * @returns o dado recebido, tipo: Date
   */
  criandoNewDateUTC0(date: string | Date) : Date{
    return new Date(new Date(date).setUTCHours(0,0,0,0))
  }

  /**
   * @param date Data que será convertida para String
   * @returns Retorna uma String com a data no formato YYYY-MM-DD
   */
  dateParaStringISO(date: Date) {
    date = this.criandoNewDateUTC0(date)
    return date.toISOString();
  }

  /**
   * 
   * @param date a data que será formatada
   * @returns uma string no formato YYYY-MM-DD
   */
  retornandoDataSemHora(date: Date | string){
    return new Date(new Date(date).setUTCHours(0,0,0,0)).toISOString().slice(0, 10)
  }

  /**
   * 
   * @param date a data que será formatada - vindo com UTC-0 e com horário 00:00
   * @returns uma string no formato DD/MM/YYYY
   */
  retornandoDataSemHoraBR(date: Date | string){
    let dia = new Date(date).getDate() + 1;
    let mes = new Date(new Date(date)).getMonth();
    let ano = new Date(new Date(date)).getFullYear();
    
    let temp = new Date(Date.UTC(ano, mes, dia))
    return temp.toLocaleString('pt-br', {timeZone: 'UTC'}).slice(0, 10)
  }

  /**
   * 
   * @param date Informa a data inicial
   * @param days Informa a quantidade de dias que serão acrescidos à data inicial
   * @returns Retorna uma data: Date com o valor atualizado
   */
  addDaysDate(date: any, days: number) {
    let result = new Date(date);
    let diff = result.getDate() + days
    result.setDate(diff);
    return result;
  }

  /**
   * 
   * @param date Informa a data inicial
   * @param days Informa a quantidade de dias que serão subtraídos da data inicial
   * @returns Retorna uma data: Date com o valor atualizado
   */
  subDaysDate(date: any, days: number) {
    let result = new Date(date);
    let diff = result.getDate() - days
    result.setDate(diff);
    return result;
  }
  
  isDate(date: string) {
    if(date.includes('/')){
      return false
    }else{
      return true
    }
  }
}
