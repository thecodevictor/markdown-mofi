import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ParametrosAccountService {

  public eventAccountSelecionado = new EventEmitter<boolean>();
  public reload: boolean = false;


  public accountSelecionado(){
    this.setAccountSelecionadoUpdate()
  }

  setAccountSelecionadoUpdate(){
    this.eventAccountSelecionado.emit(true);
  }

}
