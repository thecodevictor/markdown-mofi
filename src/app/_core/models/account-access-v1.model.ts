import { AvatarV1Model } from "./avatar-v1.model";

export class AccountAccessV1Model {
  constructor(
    public apelido: string,
    public nome: string,
    public telefone: string,
    public email: string,
    public _avatar: AvatarV1Model,
    public lock: boolean,
    public rulesUser: string[],
    public _idAccount?: string,
  ) { }
}
