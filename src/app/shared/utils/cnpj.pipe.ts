import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: false,
  name: 'cnpj'
})
export class CnpjPipe implements PipeTransform{
  transform(value: string|number) : string {
    let valorFormatado: string = value.toString();

    valorFormatado = valorFormatado
      .padStart(14, '0') //14 -> length total da variável, se não tiver, completa com 0 à esquerda, até o length de 14;
      .slice(0, 14) //Caso tenha mais de 14 caracteres, corta do primeiro ao caracter na posição 13 - a posição '14' é ignorado
      .replace(/[^0-9]/, '') //Caso tenha algum caracter que seja diferente de 0-9 substitui por ''
      .replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      ) //Captura partes do texto e substitui pelo texto formatado com os caracteres especiais
    return valorFormatado
  }
}