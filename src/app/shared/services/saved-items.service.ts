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

  // Remove um item
  removeItem(index: number) {
    const currentItems = this.savedItemsSource.value;
    currentItems.splice(index, 1);
    this.savedItemsSource.next([...currentItems]);

    // Se o item removido era o ativo, limpa o estado
    if (this.activeItemSource.value === index) {
      this.activeItemSource.next(null);
    }
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
