export class RemoveAccountAndUserModel {
  /**
   * Altera o status escluded
   * da ACCOUNT e do USER
   * se o usuário desejar excluir a própria
   * conta tornando o acesso encerrado.
   * excluded = TRUE => encerrado acesso
   * excluded = false => acesso normal
   *
   * @excluded      # TRUE usuário ativado ou FALSE usuário desativado,
   * @iduser        # id da conta de user a ser removida
   * @idaccount     # id da conta de account a ser removida
   */
  constructor(
    public excluded: boolean,
    public _iduser: string,
    public _idaccount: string,
  ) { }
}
