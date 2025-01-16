import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public eventLoader = new EventEmitter<boolean>();

  public startLoader() {
    this.setEventLoader(true);
  }
  public stopLoader() {
    this.setEventLoader(false);
  }

  setEventLoader(
    event: boolean
  ) {
    this.eventLoader.emit(event);
  }

}
