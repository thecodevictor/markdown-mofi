import { Component, Input } from "@angular/core";
import { LayoutService } from "../../services/layout.service";

@Component({
  selector: "app-svg-icon",
  templateUrl: "./svg-icon.component.html",
  standalone: false,
  styleUrls: ["./svg-icon.component.scss"],
})

export class SvgIconComponent {
  
  @Input("icon") public icon: any;

  constructor(public layoutService: LayoutService){}
  
  getSvgType() {
    return document.getElementsByClassName("sidebar-wrapper")[0].getAttribute("icon") == "stroke-svg";
  }
}
