export interface DatasIndisponiveisV1Model {
  _id: string;

  excluded: boolean;
  /**
   * _id Account de registro ao sistema referente ao cliente
   */
  _idAccount: string;
  /**
   * data em processo
   */
  data: string;
}