import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderUserService {

  public eventoAlteraDados = new EventEmitter<boolean>();
  public reload: boolean = false;


  public userAlterdoEvent(){
    this.setContaAlterada()
  }

  setContaAlterada(){
    this.eventoAlteraDados.emit(true);
  }

}
