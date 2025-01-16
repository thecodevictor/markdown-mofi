// Models
// import { AccountManagerV1Model } from "../models/account-manager/account-manager-v1.model";
// import { HeaderAppsModel } from "../models/header-apps.model";
// Util
// import { ColaboradorRoleUtil } from "../models/account-manager/colaborador-role-access.util";
// import { ColaboradorRolesV1Model } from "../models/account-manager/colaborador-role-v1.model";

export class HeaderAccessUtil {
  public static update = null;

  /**
   * Setando o localStorage contendo o header access
   * @param accountManager
   */
  // public static set(accountManager: AccountManagerV1Model) {
  //   /** criando a variavél de armazenamento */
  //   let headerAccess: HeaderAppsModel = {
  //     iscolaborador: accountManager.iscolaborador ? accountManager.iscolaborador : false,
  //     // isautomacao: accountManager.isautomacao ? accountManager.isautomacao : false,
  //     // isconfiguracoes: accountManager.isconfiguracoes ? accountManager.isconfiguracoes : false,
  //     // isempresas: accountManager.isempresas ? accountManager.isempresas : false,
  //     // isescritafiscal: accountManager.isescritafiscal ? accountManager.isescritafiscal : false,
  //     // iscontabilidade: accountManager.iscontabilidade ? accountManager.iscontabilidade : false,
  //     // isprocessos: accountManager.isprocessos ? accountManager.isprocessos : false,
  //     // isadministrativo: accountManager.isadministrativo ? accountManager.isadministrativo : false,
  //     // isrelatorios: accountManager.isrelatorios ? accountManager.isrelatorios : false,
  //   }

  //   /** Criando o localStorage item contendo o header access */
  //   localStorage.setItem('adc-header-access', btoa(JSON.stringify(headerAccess)));

  //   /** Criando as permissões */
  //   headerAccess.iscolaborador ? ColaboradorRoleUtil.set(accountManager._colaboradorrole) : null;
  //   // headerAccess.isautomacao ? localStorage.setItem('adc-automacao', btoa(JSON.stringify(headerAccess.isautomacao))) : null;
  //   // headerAccess.isconfiguracoes ? localStorage.setItem('adc-configuracoes', btoa(JSON.stringify(headerAccess.isconfiguracoes))) : null;
  //   // headerAccess.isempresas ? localStorage.setItem('adc-empresas', btoa(JSON.stringify(headerAccess.isempresas))) : null;
  //   // headerAccess.isescritafiscal ? localStorage.setItem('adc-escritafiscal', btoa(JSON.stringify(headerAccess.isescritafiscal))) : null;
  //   // headerAccess.iscontabilidade ? localStorage.setItem('adc-contabilidade', btoa(JSON.stringify(headerAccess.iscontabilidade))) : null;
  //   // headerAccess.isprocessos ? localStorage.setItem('adc-processos', btoa(JSON.stringify(headerAccess.isprocessos))) : null;
  //   // headerAccess.isadministrativo ? localStorage.setItem('adc-administrativo', btoa(JSON.stringify(headerAccess.isadministrativo))) : null;
  //   // headerAccess.isrelatorios ? localStorage.setItem('adc-relatorios', btoa(JSON.stringify(headerAccess.isrelatorios))) : null;
  // }

  /** get localStorage contendo o header access */
  // public static getHeaderAccess(): HeaderAppsModel {
  //   const data = JSON.parse(
  //     atob(localStorage.getItem('adc-header-access'))
  //   );
  //   const headerAccess: HeaderAppsModel = {
  //     iscolaborador: data.iscolaborador,
  //     // isautomacao: data.isautomacao,
  //     // isconfiguracoes: data.isconfiguracoes,
  //     // isempresas: data.isempresas,
  //     // isescritafiscal: data.isescritafiscal,
  //     // iscontabilidade: data.iscontabilidade,
  //     // isprocessos: data.isprocessos,
  //     // isadministrativo: data.isadministrativo,
  //     // isrelatorios: data.isrelatorios
  //   };
  //   return data ? headerAccess : null;
  // }

  // public static getColaboradoresAccess(): ColaboradorRolesV1Model {
  //   const data = JSON.parse(
  //     atob(localStorage.getItem('adc-header-access'))
  //   );
  //   const colaboradorAccess: ColaboradorRolesV1Model = {
  //     _id: data._id,
  //     isdsistemas: data.isdsistemas,
  //     dsistemas: data.dsistemas,
  //     isperfiladc: data.isperfiladc,
  //     perfisadc: data.perfisadc,
  //     isperfisclient: data.isperfisclient,
  //     perfisclient: data.perfisclient,
  //     isothersperfis: data.isothersperfis,
  //     othersperfis: data.othersperfis
  //   };
  //   return data ? colaboradorAccess : null;
  // }

  /** Existe headerAccess */
  public static hasHeadeAccess(): boolean {
    const data = localStorage.getItem('adc-header-access');
    return data ? true : false;
  }

}
