export class UpdatePromocaoTemporadaV1Model {
  /**
   *
   */
  constructor(
    public _id: string,
    public codigo: string,
    public isPeriodo: boolean,
    public qteReservasPodeVender: number,
    public qteReservasVendida: number,
    public qtoAdultos: number,
    public qtoJovens: number,
    public opEscolhida: number,
    public isMargem: boolean,
    public margemDesconto: number,
    public valorDesconto: number,
    public isPix: boolean,
    public margemDescontoPix: number,
    public beneficiosPacote: string,
    public dtIniPromocao?: string,
    public dtFimPromocao?: string,
    public dtIniDiaria?: string,
    public dtFimDiaria?: string,
  ) {}
}
