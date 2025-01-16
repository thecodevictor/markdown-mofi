import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TarifarioV1Model } from "src/app/routes/reservas/tarifario-gestao/models/tarifario-v1.model";
import { TarifarioAgrupadoV1Interface } from "../models/tarifario-agrupado-v1.interface";

@Injectable()

export class TarifarioComunicacaoEntreComponentesV1Service {
  private _tarifasUh = new BehaviorSubject<TarifarioAgrupadoV1Interface | undefined>(undefined);
  private _tarifarioSelecionado = new BehaviorSubject<TarifarioV1Model | undefined>(undefined);
  private _isUhSelecionado = new BehaviorSubject<boolean>(false);
  private _tarifarioAgrupadoPorUh = new BehaviorSubject<TarifarioAgrupadoV1Interface[]>([]);

  emitirTarifasUh(tarifasUh: TarifarioAgrupadoV1Interface) {
    this._tarifasUh.next(tarifasUh);
  }

  emitirTarifarioSelecionado(tarifario: TarifarioV1Model | undefined) {
    this._tarifarioSelecionado.next(tarifario);
  }

  emitirIsUhSelecionado(op: boolean) {
    this._isUhSelecionado.next(op);
  }

  emitirTarifarioAgrupadoPorUh(tarifas: TarifarioAgrupadoV1Interface[]) {
    this._tarifarioAgrupadoPorUh.next(tarifas);
  }

  get tarifasUh() {
    return this._tarifasUh.asObservable();
  }

  get tarifarioSelecionado() {
    return this._tarifarioSelecionado.asObservable();
  }

  get isUhSelecionado() {
    return this._isUhSelecionado.asObservable();
  }

  get tarifarioAgrupadoPorUh() {
    return this._tarifarioAgrupadoPorUh.asObservable();
  }

  reiniciarVariaveis() {
    this._tarifasUh = new BehaviorSubject<TarifarioAgrupadoV1Interface | undefined>(undefined);
    this._tarifarioSelecionado = new BehaviorSubject<TarifarioV1Model | undefined>(undefined);
    this._isUhSelecionado = new BehaviorSubject<boolean>(false);
    this._tarifarioAgrupadoPorUh = new BehaviorSubject<TarifarioAgrupadoV1Interface[]>([]);
  }
}