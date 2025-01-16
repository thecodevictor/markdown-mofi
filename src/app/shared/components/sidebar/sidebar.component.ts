import { Component, HostListener } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { LayoutService } from "../../services/layout.service";
import { NavService } from "../../services/nav.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Menu } from "../../services/interface/menu.interface";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { DadosDoHotelSelecionadoV1Interface } from "src/app/_core/data/dados-dos-hoteis.data";
import { SavedItemsService } from "../../services/saved-items.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  standalone: false,
  styleUrls: ["./sidebar.component.scss"],
})

export class SidebarComponent {
// Variável para controlar o modo (editar ou visualizar)
  selectedItemIndex: number | null = null;
  mode: 'edit' | 'preview' = 'edit';
  isEditable = true; // Controla se o botão "Escrever" está habilitado
  savedItems: { title: string; content: string }[] = [];
  markdownText = '';
  isEditing = true; // Controla o estado de edição ou visualização
  editingItemIndex: number | null = null; // Índice do item sendo editado
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;
  public margin: number = 0;
  public width: number = window.innerWidth;
  public isShow: boolean = false;
  public menuItemsList = this.navService.MENUITEMS;
  public pinnedData: boolean = false;
  public pinnedDataList: string[] = [];
  public hotelSelecionado: DadosDoHotelSelecionadoV1Interface;

  constructor(
    private router: Router,
    public navService: NavService,
    public layoutService: LayoutService,
    private modal: NgbModal,
    private savedItemsService: SavedItemsService
  ) {
    this.navService.items.subscribe((menuItems) => {
      console.log('menuItems')
      console.log(menuItems)
      SecurityUtil.setNav(menuItems);
      this.menuItemsList = menuItems;

      /**Filtrando somente itens de menu com o allowed = true (permitido) */
      this.menuItemsList = menuItems.filter(i => i.allowed!);
      this.menuItemsList = this.menuItemsList.filter(i => i.allowed!)

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.menuItemsList.filter((items: Menu) => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter((subItems: Menu) => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter((subSubItems: Menu) => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
              return;
            });
            return;
          });
        }
      });
    });
  }

  ngOnInit() {
    // Inscreve-se para ouvir os itens salvos
    this.savedItemsService.savedItems$.subscribe((items) => {
      this.savedItems = items;
    });
  }

  // // Função para visualizar o conteúdo do item ao clicar no título
  // viewItem(item: { title: string, content: string }, index: number) {
  //   this.markdownText = item.content;
  //   this.editingItemIndex = index; // Define qual item está sendo visualizado
  //   this.isEditing = false; // Define que estamos apenas visualizando, não editando
  //   this.setMode('preview'); // Muda para o modo de visualização
  //   this.isEditable = false; // Desabilita o botão "Escrever"
  // }

  // Visualizar um item salvo
  viewItem(item: { title: string; content: string }, index: number) {
    this.selectedItemIndex = index;

    // Atualiza o item ativo no serviço
    this.savedItemsService.setActiveItem(index);
  }

  resetEditor() {
    this.markdownText = ''; // Limpa o conteúdo do editor
    this.editingItemIndex = null; // Remove o índice ativo
    this.isEditing = true; // Ativa o modo de edição
    this.mode = 'edit'; // Garante que o modo seja "edit"
  }

  deleteItem(index: number) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.savedItemsService.removeItem(index);

      // Verifica se ainda há itens na lista
      const remainingItemsCount = this.savedItemsService.getItemsCount();

      if (remainingItemsCount === 0) {
        // Se não houver mais itens, reseta o editor
        this.resetEditor();
      } else {
        // Caso ainda haja itens, exibe o próximo item (se necessário)
        const nextIndex = index < remainingItemsCount ? index : index - 1;
        const nextItem = this.savedItemsService.getItem(nextIndex);
        if (nextItem) {
          this.viewItem(nextItem, nextIndex);
        }
      }
    }
  }

  goBackToStart() {
    this.isEditing = true; // Volta ao modo de edição para criar novo
    this.editingItemIndex = null; // Reseta o índice de edição
    this.markdownText = ''; // Limpa o texto do markdown
    this.isEditable = true; // Habilita novamente o modo "Escrever"
    this.setMode('edit'); // Certifica-se de que está no modo de edição
  }

  // Alterna entre os modos
  setMode(newMode: 'edit' | 'preview') {
    if (newMode === 'edit' && !this.isEditable) {
      return; // Impede que o modo de edição seja ativado quando não deve
    }
    this.mode = newMode;
  }

  isPined(itemName: string | undefined): boolean {
    return itemName !== undefined && this.pinnedDataList?.includes(itemName);
  }

  pinned(title: string) {
    const index = this.pinnedDataList.indexOf(title);
    if (index !== -1) {
      this.pinnedDataList.splice(index, 1);
    } else {
      this.pinnedDataList.push(title);
    }
    if (this.pinnedDataList.length <= 0) {
      this.pinnedData = false;
    } else {
      this.pinnedData = true;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: { target: { innerWidth: number } }) {
    this.width = event.target.innerWidth - 500;
  }

  setNavActive(item: Menu) {
    this.menuItemsList.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          } else {
            submenuItems.active = false;
          }
        });
      }
    });
  }

  sidebarToggle() {
    this.navService.collapseSidebar = !this.navService.collapseSidebar;
  }

  toggletNavActive(item: Menu) {
    if (!item.active) {
      this.menuItemsList.forEach((a: Menu) => {
        if (this.menuItemsList.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: Menu) => {
          if (a.children?.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    item.active = !item.active;
  }

  scrollToLeft() {
    if (this.margin >= -this.width) {
      this.margin = 0;
      this.leftArrowNone = true;
      this.rightArrowNone = false;
    } else {
      this.margin += this.width;
      this.rightArrowNone = false;
    }
  }

  scrollToRight() {
    if (this.margin <= -3500) {
      this.margin = -3000;
      this.leftArrowNone = false;
      this.rightArrowNone = true;
    } else {
      this.margin += -this.width;
      this.leftArrowNone = false;
    }
  }
}
