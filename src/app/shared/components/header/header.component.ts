import { Component } from "@angular/core";
import { NavService } from "../../services/nav.service";
import { SearchService } from "../../services/search.service";
import { DadosDoHotelSelecionadoV1Interface } from "src/app/_core/data/dados-dos-hoteis.data";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: false
})

export class HeaderComponent {

  public isFlip: boolean = false;
  public isSearchOpen: boolean = false;
  public open: boolean = false;
  public hotelSelecionado: DadosDoHotelSelecionadoV1Interface;

  constructor(
    public navService: NavService,
    public searchService: SearchService
  ) {
    if (localStorage.getItem('hotelSelecionado')) {
      this.hotelSelecionado = JSON.parse(atob(localStorage.getItem('hotelSelecionado')!));
    }
  }

  sidebarToggle() {
    this.navService.collapseSidebar = !this.navService.collapseSidebar;
  }
}
