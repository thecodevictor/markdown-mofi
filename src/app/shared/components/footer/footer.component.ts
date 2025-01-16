import { Component } from "@angular/core";
import { DadosDoHotelSelecionadoV1Interface } from "src/app/_core/data/dados-dos-hoteis.data";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: false
})

export class FooterComponent  {
  // variáveis de ambiente
  hotelSelecionado: DadosDoHotelSelecionadoV1Interface;
  constructor() {
    if(localStorage.getItem('hotelSelecionado')){
      this.hotelSelecionado = JSON.parse(atob(localStorage.getItem('hotelSelecionado')!));
    }
  }
}
