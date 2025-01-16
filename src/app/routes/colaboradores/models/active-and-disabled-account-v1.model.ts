export class ActiveAndDisabledAccountV1Model {
  /**
   * DTO de ativado ou desativado
   * usuário na epigrafo
   *
   * @param _id      # _id de identificação do user
   * @param apelido  # apelido do usuário a ser ativado
   * @param lock   # TRUE ativado, FALSE desativado
   */
  constructor(
    public _id: string,
    public apelido: string,
    public lock: boolean,
  ) { }
}
