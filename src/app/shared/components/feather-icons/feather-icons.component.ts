import { Component, Input } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-feather-icons',
  templateUrl: './feather-icons.component.html',
  standalone: false,
  styleUrls: ['./feather-icons.component.scss']
})

export class FeatherIconsComponent {

  @Input() icons: string | any;
  @Input() class: string | any;

 
  ngAfterViewInit() {
    feather.replace();
  }
}
