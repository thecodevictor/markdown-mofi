import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavedItemsService {
  private savedItemsSource = new BehaviorSubject<{ title: string; content: string }[]>([]);
  private activeItemSource = new BehaviorSubject<number | null>(null);

  savedItems$ = this.savedItemsSource.asObservable(); // Observable para ouvir alterações na lista
  activeItem$ = this.activeItemSource.asObservable(); // Observable para ouvir o item ativo

  // Adiciona um novo item
  addItem(item: { title: string; content: string }) {
    const currentItems = this.savedItemsSource.value;
    this.savedItemsSource.next([...currentItems, item]);
  }

  removeItem(index: number) {
    const currentItems = this.savedItemsSource.value;
    currentItems.splice(index, 1); // Remove o item pelo índice
    this.savedItemsSource.next([...currentItems]);

    // Limpa o item ativo se não houver mais itens
    if (currentItems.length === 0) {
      this.activeItemSource.next(null);
    }
  }

  getItemsCount(): number {
    return this.savedItemsSource.value.length; // Retorna o número de itens
  }

  getItem(index: number): { title: string; content: string } | null {
    const items = this.savedItemsSource.value;
    return items[index] || null; // Retorna o item ou null se não existir
  }

  // Define o item ativo
  setActiveItem(index: number) {
    this.activeItemSource.next(index);
  }

  // Obtém o item ativo
  getActiveItem() {
    const currentItems = this.savedItemsSource.value;
    const activeIndex = this.activeItemSource.value;
    return activeIndex !== null ? currentItems[activeIndex] : null;
  }

   // Método para atualizar um item existente
   updateItem(index: number, item: { title: string; content: string }) {
    const currentItems = this.savedItemsSource.value;
    currentItems[index] = item;
    this.savedItemsSource.next([...currentItems]);
  }


}
