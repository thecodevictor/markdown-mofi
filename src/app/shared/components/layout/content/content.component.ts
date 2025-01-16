import { Component, HostListener } from "@angular/core";
import { LayoutService } from "../../../../shared/services/layout.service";
import { NavService } from "../../../../shared/services/nav.service";
import { Router } from "@angular/router";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
  standalone: false
})

export class ContentComponent {
  public innerWidth: number;
  public footerFix = false;
  public footerLight = false;
  public footerDark: boolean = true;

  constructor(
    public navService: NavService,
    public layout: LayoutService,
    private route: Router,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    if (window.innerWidth <= 1200) {
      this.layout.config.settings.sidebar_type = "page-wrapper compact-wrapper";
    }
  }

  get layoutClass() {
    return (
      this.layout.config.settings.sidebar_type + ''
    );
  }

  ngOnDestroy() {
    this.footerDark = false;
  }
}
