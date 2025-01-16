export class ClienteEmpresaV1Model {
  /**
   * model de construção de nome fantasia da empresa
   *
   * @param _id               #
   * @param _idAccount        #
   * @param excluded            # FALSE a conta esta normal, TRUE a conta não pode ter acesso ao sistema, dada como excluida
   * @param nomeFantasia      #
   * @param razaoSocial       #
   * @param cnpjCpf           #
   * @param inscEstadual      #
   * @param telefone          #
   */
  constructor(
    public _id: string,
    public _idAccount: string,
    public excluded: boolean,
    public actived: boolean,
    public nomeFantasia: string,
    public razaoSocial: string,
    public cnpjCpf: string,
    public inscEstadual: string,
    public telefone: string[]
  ) { }
}
