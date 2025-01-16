export class ResultV1Model {
  /**
   * modelo de resultado para o cliente
   *
   * @success			# TRUE se obteve sucesso na tarefa ou FALSE quando mal sucedido
   * @titulo      # Título da mensagem de retorno
   * @message			# Mensagem de restorno da tarefa solicitada
   * @data				# Dados da tarefas quando solicitado
   * @error				# mensagem de erro quando ocorrido
   */
  constructor(
    public success: boolean,
    public titulo: string,
    public message: string,
    public data: any,
    public error: any,
  ) { }
}
