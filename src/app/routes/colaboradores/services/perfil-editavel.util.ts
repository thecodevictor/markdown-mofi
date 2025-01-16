import { AccountV1Model } from "src/app/_core/models/account-v1.model";

export class PerfilEditavelUtil {
  public static update = null;

  public static setPerfilEditavel(
    perfilEditavel: AccountV1Model
  ) {
    localStorage.setItem('perfil', btoa(JSON.stringify(perfilEditavel)));
  }

  public static getPerfilEditavel(): AccountV1Model | null {
    const data = JSON.parse(atob(localStorage.getItem('perfil') as string));
    if (data) {
      const account = new AccountV1Model(
        data._id,
        data.excluded,
        data.nome,
        data.telefone,
        data._avatar,
        data._user,
        data.tpAccount,
        data._empresaAccount,
        data._rulesAccount
      )
      return account;
    } else {
      return null;
    }
  }

  public static hasPerfilEditavel(): boolean {
    if (this.getPerfilEditavel())
      return true;
    else
      return false;
  }

  public static clear() {
    localStorage.removeItem('perfil');
  }
}
