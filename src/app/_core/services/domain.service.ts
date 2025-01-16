// TypeScript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private domain: string;

  constructor() {
    this.domain = window.location.hostname;
  }

  getDomain(): string {
    return this.domain;
  }

  isHotelCTC(): boolean {
    return this.domain === 'app.hotelctc.com.br';
  }

  isAdtur(): boolean {
    return this.domain === 'app.adtur.com.br';
  }
}
