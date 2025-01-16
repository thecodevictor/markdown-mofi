import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comman-svg-icon',
  standalone: false,
  templateUrl: './comman-svg-icon.component.html',
  styleUrls: ['./comman-svg-icon.component.scss']
})

export class CommanSvgIconComponent {

  @Input("icon") public icon: any;
  @Input("class") public class: any;

}
