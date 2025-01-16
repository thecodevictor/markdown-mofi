import { AccountV1Model } from "src/app/_core/models/account-v1.model";
import { PromocaoTemporadaV1Model } from "./promocao-temporada-v1.model";

/**
 * Documentação
 * @param _id                     # _id de identificação no banco de dados
 * @param _idAccount              # _idAccount de identificação do cliente epg no banco de dados
 * @param excluded                # Verifica se o cupom esta habilitado/desabilitado
 *                                  True -> desabilitado
 *                                  False -> habilitado1
 * @param active                  # Verifica se o cupom esta ativo para uso
 *                                  True -> ATIVO
 *                                  False -> DESATIVADO
 * @param codigo                  # codigo da promoção, identificação da mesma
 * @param isPeriodo               # Verifica se a promocao é por periodo
 * @param dtIniPromocao           # data inicio da promoção
 * @param dtFimPromocao           # data fim da promoção
 * @param dtIniDiaria             # data inicio das diárias
 * @param dtFimDiaria             # data fim das diárias
 * @param qteReservasPodeVender   # quantidade de reservas permitidas para promoção
 * @param qteReservasVendida      # quantidade de reservas foram vendias nesta promoção
 * @param qtoAdultos              # quantidade de adultos para promoção
 * @param qtoJovens               # quantidade de jovens para promoção
 * @param opEscolhida             # Opção escolhida, 1 Só café da manha, 2 meia pensão e 3 pensão completa
 * @param isMargem                # o desconto e margem o valor fixo
 * @param margemDesconto          # em caso de margem de desconto, margem a ser aplicada
 * @param valorDesconto           # em caso de valor fixo, valor a ser aplicado
 * @param isPix                   # o pagamento e ém pix?
 * @param margemDescontoPix       # Margem de desconto para pagamento em pix
 * @param beneficiosPacote        # Descrição de beneficios de pacotes na promoção
 * @param isTemporada             # Verifica se a promoção é por temporada
 * @param temporada               # Lista de datas checkin e checkout na promoção temporada
 * @param _Account                # _Account do user que criou a promoção
 */


export class PromocaoReservaV1Model {
  constructor(
    public _id: string,
    public _idAccount: string,
    public excluded: boolean,
    public active: boolean,
    public codigo: string,
    public isPeriodo: boolean,
    public isTemporada: boolean,
    public dtIniPromocao: string,
    public dtFimPromocao: string,
    public dtIniDiaria: string,
    public dtFimDiaria: string,
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
    public _Account: AccountV1Model,
    public temporada?: PromocaoTemporadaV1Model[],
  ) { }
}


