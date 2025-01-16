import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ComunicacaoEntreComponentesContasWebService {
  private _tipoUsuarioSendoAtualizado = new BehaviorSubject<'outros-perfis' | 'meu-perfil'>('meu-perfil');

  get tipoUsuarioSendoAtualizado() {
    return this._tipoUsuarioSendoAtualizado.asObservable();
  }

  emitirTipoUsuarioSendoAtualizado(tipo: 'outros-perfis' | 'meu-perfil') {
    this._tipoUsuarioSendoAtualizado.next(tipo);
  }
}