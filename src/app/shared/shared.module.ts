import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbModule,
  NgbNavModule,
  NgbRatingModule,
  NgbTooltipModule,
  NgbTypeahead,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from "@ng-select/ng-select";
import { NgApexchartsModule } from "ng-apexcharts";
import { LightboxModule } from "ng-gallery/lightbox";
import { BarRatingModule } from "ngx-bar-rating";
import { NgxDropzoneModule } from "ngx-dropzone";
import { CarouselModule } from "ngx-owl-carousel-o";
import { NgxPrintModule } from "ngx-print";
import { NgxSliderModule } from "ngx-slider-v2";

import { ToastrModule } from "ngx-toastr";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { CommanSvgIconComponent } from "./components/comman-svg-icon/comman-svg-icon.component";
import { FeatherIconsComponent } from "./components/feather-icons/feather-icons.component";
import { FooterComponent } from "./components/footer/footer.component";
import { BookmarkComponent } from "./components/header/bookmark/bookmark.component";
import { CartComponent } from "./components/header/cart/cart.component";
import { HeaderComponent } from "./components/header/header.component";
import { LanguageComponent } from "./components/header/language/language.component";
import { MessagesComponent } from "./components/header/messages/messages.component";
import { NotiticationsComponent } from "./components/header/notitications/notitications.component";
import { ProfileComponent } from "./components/header/profile/profile.component";
import { SearchComponent } from "./components/header/search/search.component";
import { ThemeModeComponent } from "./components/header/theme-mode/theme-mode.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { NaoHaDadosAVisualizarComponent } from "./nao-ha-dados-a-visualizar/nao-ha-dados-a-visualizar.component";
import { CnpjPipe } from "./utils/cnpj.pipe";
import { CpfPipe } from "./utils/cpf.pipe";

@NgModule({
  declarations: [
    ContentComponent,
    FullComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    TapToTopComponent,
    FeatherIconsComponent,
    SearchComponent,
    NotiticationsComponent,
    BookmarkComponent,
    MessagesComponent,
    CartComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    ThemeModeComponent,
    ProfileComponent,
    CommanSvgIconComponent,
    LanguageComponent,
    ClickOutsideDirective,
    NaoHaDadosAVisualizarComponent,
    CnpjPipe,
    CpfPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
    BarRatingModule,
    CarouselModule,
    NgxSliderModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgbNavModule,
    NgxPrintModule,
    LeafletModule,
    GalleryModule,
    AngularEditorModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbTypeahead,
    LightboxModule,
    NgxPaginationModule,
  ],
  exports: [
    FeatherIconsComponent,
    TapToTopComponent,
    SvgIconComponent,
    CommanSvgIconComponent,
    LoaderComponent,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    NgxDropzoneModule,
    BarRatingModule,
    CarouselModule,
    NgxSliderModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgbNavModule,
    NgxPrintModule,
    LeafletModule,
    GalleryModule,
    AngularEditorModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbTypeahead,
    LightboxModule,
    NgxPaginationModule,
    ClickOutsideDirective,
    NaoHaDadosAVisualizarComponent,
    CnpjPipe,
    CpfPipe
  ],

  providers: [NgbActiveModal],
})
export class SharedModule {}
