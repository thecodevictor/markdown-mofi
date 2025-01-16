export class AvatarV1Model {
  constructor(
    /** id (Chave) único criado pelo banco de dados */
    public _id: string,

    /** _id account da empresa cliente */
    public _idAccount: string,

    /** url do arquivo de avatar da conta */
    public url: string,

    /** nome da pasta/arquivo enviado ao s3 */
    public name: string,

    /** define se a img de avatar e:
     * masculina, feminina, outros e nuvem
     */
    public type: string,

    /** se este avatar e utilizando pela EPIGRAFO (TRUE ou FALSE) como público */
    public epg: boolean
  ) { }
}
