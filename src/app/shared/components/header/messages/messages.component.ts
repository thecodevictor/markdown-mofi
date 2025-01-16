import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  standalone: false,
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent {

  public isShow : boolean = false;

}
