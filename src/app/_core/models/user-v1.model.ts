export class UserV1Model {
  constructor(
    /** id (Chave) único criado pelo banco de dados */
    public _id: string,

    /** FALSE conta de USER funcionando normal, TRUE não pode ter acesso ao sistema, dada como removida */
    public excluded: boolean,

    /** Apelido da conta informada pelo user o registro  */
    public apelido: string,

    /** e-mail de acesso aos serviços CONTAB */
    public email: string,

    /** chave de acesso (password) aos serviços CONTAB */
    public accesskey: string,

    /** account livre ou bloqueada (TRUE ou FALSE) */
    public lock: boolean,

    /** permissões de acesso do usuário aos módulos CONTAB */
    public rulesUser: string[]
  ) { }
}
