import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MENUCOLABORADORES } from "src/app/routes/colaboradores/menu-colaboradores";
import { MENUHOME } from "src/app/routes/home/home.menu";
import { MENURESERVAS } from "src/app/routes/reservas/reservas.menu";
import { NavService } from "src/app/shared/services/nav.service";

@Component({
  selector: "app-bookmark",
  templateUrl: "./bookmark.component.html",
  standalone: false,
  styleUrls: ["./bookmark.component.scss"],
})

export class BookmarkComponent {
  modulos = [
    {
      id: 1,
      icon: 'fa-slack',
      heading: "Módulo",
      title: "MARKDOWN",
      subtitle: 'Módulo Markdown',
      allowed: true,
      bgColor: "primary",
    },
    // {
    //   id: 2,
    //   icon: 'fa-users',
    //   heading: "Módulo Colaboradores",
    //   title: "Colaboradores",
    //   subtitle: 'Módulo para gestão dos colaboradores',
    //   allowed: true,
    //   bgColor: "secondary",
    // },
    // {
    //   id: 3,
    //   icon: 'fa-calendar',
    //   heading: "Módulo Reservas",
    //   title: "Gestor de Reservas",
    //   subtitle: 'Módulo para gestão das reservas',
    //   allowed: true,
    //   bgColor: "tertiary",
    // },
    // {
    //   id: 4,
    //   icon: 'fa-bank',
    //   heading: "Módulo Financeiro",
    //   subtitle: 'Módulo para gestão financeira',
    //   title: "Saúde Financeira",
    //   allowed: false,
    //   bgColor: "primary",
    // },
  ]

  constructor(
    public route: Router,
    public navService: NavService,
  ) { }

  alterarParaOModuloSelecionado(modulo: string) {
    switch (modulo) {
      // case 'Módulo Markdown':
      //   this.route.navigate([`/dashboard/mapa-diario`]);
      //   this.navService.items.next(MENURESERVAS);
      //   break;
      // case 'Módulo Colaboradores':
      //   this.route.navigate([`/dashboard/mapa-diario`]);
      //   this.navService.items.next(MENUCOLABORADORES);
      //   break;
      // case 'Módulo Financeiro':
      //   this.route.navigate([`/dashboard/mapa-diario`]);
      //   this.navService.items.next(MENUHOME);
      //   break;
      default:
        this.route.navigate([`/markdown`]);
        this.navService.items.next(MENUHOME);
        break;
    }
  }
}
