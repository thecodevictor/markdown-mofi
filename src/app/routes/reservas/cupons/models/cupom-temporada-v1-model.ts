import { TemporadaV1Model } from "./temporada-v1-model";

export class CupomTemporadaV1Model {
  constructor(
    
    /**
     * @param tpcupom # Define se o cupom será Porcentagem de Desconto (TRUE)
     *                  ou Valor fixo (FALSE)
     */
    public tpcupom: boolean,
    
    /**
     * @param codecupom # Define o código identificador do cupom
     */
    public codecupom: string,

    /**
     * @param porcent # Caso tpcupom = true, informa o valor da porcentagem neste campo
     */
    public porcent: number,

    /**
     * @param valor # Caso tpcupom = false, informa o valor fixo (R$), neste campo
     */
    public valor: number,

    /**
     * @param temporada # Array que agrupa as datas de checkin e checkout que o
     *                    usuário poderá cadastrar, contendo tbm o campo obs,
     *                    onde o usuário poderá informar detalhes, caso deseje.
     */
    public temporada: TemporadaV1Model[]
  ) {}
}
