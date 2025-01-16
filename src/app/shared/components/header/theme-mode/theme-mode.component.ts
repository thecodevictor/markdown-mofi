import { Component } from "@angular/core";
import { LayoutService } from "../../../../shared/services/layout.service";

@Component({
  selector: "app-theme-mode",
  templateUrl: "./theme-mode.component.html",
  standalone: false,
  styleUrls: ["./theme-mode.component.scss"],
})
export class ThemeModeComponent {
  
  public dark: boolean = this.layout.config.settings.layout_version == "dark-only" ? true : false;

  constructor(public layout: LayoutService) {}

  layoutToggle() {
    this.dark = !this.dark;
    this.dark ? document.body.classList.add("dark-only") : document.body.classList.remove("dark-only");
    this.layout.config.settings.layout_version = this.dark ? "dark-only" : "light";
  }
}
