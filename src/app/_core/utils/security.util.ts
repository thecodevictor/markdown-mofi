// Components do sistema
import { HttpHeaders } from '@angular/common/http';
// Models
import { AccountAccessV1Model } from '../models/account-access-v1.model';
import { Menu } from 'src/app/shared/services/interface/menu.interface';
import { MENUHOME } from 'src/app/routes/home/home.menu';
import { accountaccess, accesstoken } from '../api';

export class SecurityUtil {
  public static update = null;

  public static set(
    account: AccountAccessV1Model,
    token: string,
    nav: Menu[]
  ) {
    localStorage.setItem('adc-account', btoa(JSON.stringify(account)));
    localStorage.setItem('adc-token', token);
    localStorage.setItem('adc-nav', btoa(JSON.stringify(nav)));
  }

  public static setAccount(account: AccountAccessV1Model) {
    localStorage.setItem('adc-account', btoa(JSON.stringify(account)));
  }

  public static setToken(token: string) {
    localStorage.setItem('adc-token', token);
  }

  public static setNav(nav: Menu[]) {
    localStorage.setItem('adc-nav', btoa(JSON.stringify(nav)));
  }

  public static getAccount(): AccountAccessV1Model | null {
    let data;
    if (localStorage.getItem('adc-account')) {
      data = JSON.parse(atob(localStorage.getItem('adc-account') || ''));
    } else {
      data = '';
    }
    const account: AccountAccessV1Model = data;
    if (data) {
      return account;
    } else {
      return null;
    }
  }

  public static getToken(): string | null {
    const data = localStorage.getItem('adc-token');
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  public static getNav(): Menu[] {
    let data;
    if (localStorage.getItem('adc-nav')) {
      data = JSON.parse(atob(localStorage.getItem('adc-nav') || ''));
    } else {
      data = MENUHOME;
    }
    const nav: Menu[] = data;

    console.log('data')
    console.log(data)
    if (data.length != 0) {
      return nav;
    } else {
      return MENUHOME;
    }
  }

  public static hasToken(): boolean {
    if (this.getToken())
      return true;
    else
      return false;
  }

  public composeHeader() {
    const token = localStorage.getItem('adc-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  public composeHeaderAsaas() {
    const headers = new HttpHeaders().set('accountaccess', accountaccess);
    return headers;
  }

  public composeHeaderSerpro() {
    const headers = new HttpHeaders().set('accesstoken', accesstoken);
    return headers;
  }

  public static clear() {
    localStorage.removeItem('ctc-token');
    localStorage.removeItem('adc-account');
    localStorage.removeItem('adc-token');
    localStorage.removeItem('adc-nav');
    localStorage.removeItem('perfil')
  }
}
