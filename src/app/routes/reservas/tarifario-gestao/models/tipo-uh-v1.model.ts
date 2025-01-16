export class TipoUhV1Model {
  constructor(
    public _id?: string,
    public _idAccount?: string,
    public idHotel?: number,
    public nomeHotel?: string,
    public idTipoUh?: number,
    public nomeTipoUh?: string,
    public totalQuartos?: number,
    public capacidade?: number,
    public qtdCama?: number,
  ) { }
}
