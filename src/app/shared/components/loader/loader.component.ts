import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false,
})

export class LoaderComponent {

  public show: boolean = false;

  constructor(
    private loaderService: LoaderService
  ) {
    this.loaderService.eventLoader
    .subscribe((v) => {
      this.show = v;
    });
  }




}
