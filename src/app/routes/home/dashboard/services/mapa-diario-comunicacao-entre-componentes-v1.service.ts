import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { MapaDispV1Model } from "../models/mapa-disp-v1.model";

@Injectable()

export class MapaDiarioComunicacaoEntreComponentesV1Service {
  private _periodoConsulta = new BehaviorSubject<{ dtInicial: Date, dtFinal: Date }>(
    {
      dtInicial: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      dtFinal: new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 25) //Data acrescentando 25 dias à data inicial.
    }
  );
  private _mapaSelecionado = new Subject<MapaDispV1Model[]>();
  private _margemDescontoPadrao = new Subject<number>();
  private _margemOcupacaoPadrao = new Subject<number>();

  get mapaSelecionado() {
    return this._mapaSelecionado.asObservable();
  }

  emitirMapaSelecionado(mapa: MapaDispV1Model[]) {
    this._mapaSelecionado.next(mapa);
  }

  get periodoDaConsulta() {
    return this._periodoConsulta.asObservable();
  }

  emitirPeriodoConsulta(datas: {
    dtInicial: Date,
    dtFinal: Date
  }) {
    this._periodoConsulta.next(datas);
  }

  get margemDescontoPadrao() {
    return this._margemDescontoPadrao.asObservable();
  }

  emitirMargemDescontoPadrao(margem: number) {
    this._margemDescontoPadrao.next(margem);
  }

  get margemOcupacaoPadrao() {
    return this._margemOcupacaoPadrao.asObservable();
  }

  emitirMargemOcupacaoPadrao(margem: number) {
    this._margemOcupacaoPadrao.next(margem);
  }

  reiniciarVariaveis() {
    this._periodoConsulta = new BehaviorSubject<{ dtInicial: Date, dtFinal: Date }>(
      {
        dtInicial: new Date(), //inicia por padrão na data de hoje
        dtFinal: new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 25) //Data acrescentando 25 dias à data inicial.
      }
    );
    this._mapaSelecionado = new Subject<MapaDispV1Model[]>();
    this._margemDescontoPadrao = new Subject<number>();
    this._margemOcupacaoPadrao = new Subject<number>();
  }
}