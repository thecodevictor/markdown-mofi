import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { RulesAccountV1Model } from "../models/rules-account-v1.model";
import { RulesReservasV1Model } from "../models/rules-reservas-v1.model";
import { RulesColaboradorV1Model } from "../models/rules-colaborador-v1.model";

@Injectable()

export class ComunicacaoComponentesPermissoesService {
  _acaoSendoRealizada = new BehaviorSubject<'lista' | 'cadastro' | 'edicao' | 'visualizacao'>('lista');
  _permissaoSelecionada = new BehaviorSubject<RulesAccountV1Model | undefined>(undefined);
  _permissoesDefinidasModuloReservas = new BehaviorSubject<RulesReservasV1Model | undefined>(undefined);
  _permissoesDefinidasModuloColaborador = new BehaviorSubject<RulesColaboradorV1Model | undefined>(undefined);

  get acaoSendoRealizada() {
    return this._acaoSendoRealizada.asObservable();
  }

  get permissaoSelecionada() {
    return this._permissaoSelecionada.asObservable();
  }

  get permissoesDefinidasModuloReservas() {
    return this._permissoesDefinidasModuloReservas.asObservable();
  }

  get permissoesDefinidasModuloColaborador() {
    return this._permissoesDefinidasModuloColaborador.asObservable();
  }

  emitirAcaoSendoRealizada(acao: 'lista' | 'cadastro' | 'edicao' | 'visualizacao') {
    this._acaoSendoRealizada.next(acao);
  }

  emitirPermissaoSelecionada(permissao: RulesAccountV1Model | undefined) {
    this._permissaoSelecionada.next(permissao);
  }

  emitirPermissoesDefinidasModuloReservas(permissoes?: RulesReservasV1Model) {
    this._permissoesDefinidasModuloReservas.next(permissoes);
  }

  emitirPermissoesDefinidasModuloColaborador(permissoes?: RulesColaboradorV1Model) {
    this._permissoesDefinidasModuloColaborador.next(permissoes);
  }

  reiniciarVariaveis() {
    this._acaoSendoRealizada = new BehaviorSubject<'lista' | 'cadastro' | 'edicao' | 'visualizacao'>('lista');
    this._permissaoSelecionada = new BehaviorSubject<RulesAccountV1Model | undefined>(undefined);
    this._permissoesDefinidasModuloReservas = new BehaviorSubject<RulesReservasV1Model | undefined>(undefined);
    this._permissoesDefinidasModuloColaborador = new BehaviorSubject<RulesColaboradorV1Model | undefined>(undefined);
  }
}