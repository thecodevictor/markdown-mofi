import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nao-ha-dados-a-visualizar',
  templateUrl: './nao-ha-dados-a-visualizar.component.html',
  standalone: false,
})
export class NaoHaDadosAVisualizarComponent {
  @Input() dado!: string;
}
