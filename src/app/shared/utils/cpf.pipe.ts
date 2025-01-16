import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: false,
  name: 'cpf'
})
export class CpfPipe implements PipeTransform{
  transform(value: string | number) : string {
    let valorFormatado: string = value.toString();
    
    valorFormatado = valorFormatado
    .padEnd(11, '0') //11 -> length total da variável, se não tiver, completa com 0 à esquerda, até o length de 11;
    .slice(0, 11) //Caso tenha mais de 11 caracteres, corta do primeiro ao caracter na posição 10 - a posição '11' é ignorada
    .replace(/[^0-9]/, '') //Caso tenha algum caracter que seja diferente de 0-9 substitui por ''
    .replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    ) //Captura partes do texto e substitui pelo texto formatado com os caracteres especiais
    return valorFormatado
  }
}