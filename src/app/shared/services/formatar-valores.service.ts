import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatarValoresService {

  constructor() { }

  formatar(value?: number | string | Event): string {
    if (typeof value === 'object') {
      value = (value.target as HTMLInputElement).value
    }

    value = Number(value);

    const valor: number = value ? value : 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
