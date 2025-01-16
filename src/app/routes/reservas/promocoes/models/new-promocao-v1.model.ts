import { PromocaoTemporadaV1Model } from "./promocao-temporada-v1.model";

export class NewPromocaoV1Model {
 /**
  *
  */
 constructor(
  public codigo: string,
  public isPeriodo: boolean,
  public isTemporada: boolean,
  public temporada: PromocaoTemporadaV1Model[],
  public qteReservasPodeVender: number,
  public isMargem: boolean,
  public isPix: boolean,
  public dtIniPromocao?: string,
  public dtFimPromocao?: string,
  public dtIniDiaria?: string,
  public dtFimDiaria?: string,
  public margemDescontoPix?: number,
  public qtoAdultos?: number,
  public qtoJovens?: number,
  public margemDesconto?: number,
  public valorDesconto?: number,
  public opEscolhida?: number,
  public beneficiosPacote?: string,
 ) {}
}
