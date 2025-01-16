export class MargemDescontoDiarioV1Model {
  /**
   * -- Documentação --
   * Margem de Desconto avaliado dia a dia
   *
   * @param _id             // código id gerado pelo mongoDb
   * @param _idAccount      // código de identificação do user autenticado
   * @param excluded        // True -> excluido e False -> ñ excluido
   * @param margemDesconto  // Margem de desconto definida por dia
   * @param data            // Data em que se aplica a margem de desconto
   *                           margem: number,
   *                           data: Date
  */

  constructor(
    public _id: string,
    public _idAccount: string,
    public excluded: boolean,
    public margemDesconto: number,
    public data: Date
  ) { }
}


