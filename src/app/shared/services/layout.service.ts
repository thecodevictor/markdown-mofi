import { Injectable } from '@angular/core';
import { DadosDoHotelSelecionadoV1Interface } from 'src/app/_core/data/dados-dos-hoteis.data';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private hotelSelecionado: DadosDoHotelSelecionadoV1Interface;
  public customizer: string = '';

  public config = {
    settings: {
      layout_type: 'ltr',
      layout_version: 'dark-sidebar',
      sidebar_type: 'compact-wrapper',
      icon: "stroke-svg",
    },
    color: {
      primary_color: '#7A70BA',
      secondary_color: '#48A3D7',
    },
  };

  constructor() { }
}
