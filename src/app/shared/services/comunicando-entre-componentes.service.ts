import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ComunicandoEntreComponentesLoginService {
  private _atualizaAvatarImage = new Subject<boolean>();

  get atualizaAvatarImage() {
    return this._atualizaAvatarImage.asObservable();
  }

  atualizarAvatar() {
    this._atualizaAvatarImage.next(true)
  }
}