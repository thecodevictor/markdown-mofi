import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { Router } from '@angular/router';
// @ts-ignore
import * as emojione from 'emoji-toolkit';
import { forkJoin } from 'rxjs';
import { SavedItemsService } from 'src/app/shared/services/saved-items.service';

@Component({
  selector: 'app-markdown',
  standalone: true,
  imports: [
    FormsModule,
    MarkdownModule,
    CommonModule,
  ],
  providers: [
    provideMarkdown()
  ],
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent {

  markdownText = '';
  savedItems: { title: string, content: string }[] = [];
  isEditing = true; // Controla o estado de edição ou visualização
  editingItemIndex: number | null = null; // Índice do item sendo editado

  showSelector = false;
  maxRows = 5; // Número máximo de linhas mostradas
  maxCols = 5; // Número máximo de colunas mostradas
  selectedRows = 0;
  selectedCols = 0;

  // Variável para controlar o modo (editar ou visualizar)
  mode: 'edit' | 'preview' = 'edit';
  isEditable = true; // Controla se o botão "Escrever" está habilitado
  activeItemIndex: number | null = null;
  originalMarkdownText = ''; // Para armazenar o conteúdo original ao editar

  constructor(
    private router: Router,
    private savedItemsService: SavedItemsService
  ) { }

  ngOnInit() {
    // Escuta o item ativo
    this.savedItemsService.activeItem$.subscribe((index) => {
      if (index !== null) {
        const activeItem = this.savedItemsService.getActiveItem();
        if (activeItem) {
          this.markdownText = activeItem.content;
          this.originalMarkdownText = activeItem.content;
          this.editingItemIndex = index;
          this.isEditing = false; // Inicia no modo de visualização
          this.mode = 'preview';
        }
      } else {
        this.resetEditor();
      }
    });
  }

  // Alterna entre modos de edição e visualização
  setMode(mode: 'edit' | 'preview') {
    this.mode = mode;
  }

  triggerImageUpload() {
    const fileInputElement = document.getElementById('imageUpload') as HTMLInputElement;
    fileInputElement.click();
  }

  uploadImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageMarkdown = `![Imagem](${reader.result})`;
        this.insertMarkdownAtCursor(imageMarkdown);
      };
      reader.readAsDataURL(file);
    }
  }

  insertMarkdownAtCursor(markupText: string) {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    this.markdownText =
      textarea.value.substring(0, start) +
      markupText +
      textarea.value.substring(end);

    textarea.focus();
    textarea.setSelectionRange(start + markupText.length, start + markupText.length);
  }

  // Função para adicionar/remover formatação
  addFormatting(prefix: string, suffix: string) {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selectedText = textarea.value.substring(start, end);

    // Remover espaços em branco no início e no fim da seleção
    const trimmedStart = start + (selectedText.match(/^\s*/)?.[0]?.length ?? 0);
    const trimmedEnd = end - (selectedText.match(/\s*$/)?.[0]?.length ?? 0);
    selectedText = textarea.value.substring(trimmedStart, trimmedEnd);

    // Verificar se o texto já está formatado
    const hasPrefix = selectedText.startsWith(prefix);
    const hasSuffix = selectedText.endsWith(suffix);

    let formattedText: string;
    let newStart = trimmedStart;
    let newEnd = trimmedEnd;

    if (hasPrefix && hasSuffix) {
      // Remover a formatação se já estiver aplicada
      formattedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
      newEnd = trimmedEnd - prefix.length - suffix.length;
    } else {
      // Adicionar a formatação se não estiver aplicada
      formattedText = `${prefix}${selectedText}${suffix}`;
      newEnd = trimmedEnd + prefix.length + suffix.length;
    }

    // Atualizar o valor do textarea
    this.markdownText =
      textarea.value.substring(0, trimmedStart) +
      formattedText +
      textarea.value.substring(trimmedEnd);

    // Reposicionar o cursor e manter a seleção com os caracteres especiais incluídos
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    });
  }

  addEmoji(prefix: string, suffix: string) {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selectedText = textarea.value.substring(start, end);

    // Remover espaços em branco no início e no fim da seleção
    const trimmedStart = start + (selectedText.match(/^\s*/)?.[0]?.length ?? 0);
    const trimmedEnd = end - (selectedText.match(/\s*$/)?.[0]?.length ?? 0);
    selectedText = textarea.value.substring(trimmedStart, trimmedEnd);

    // Verificar se o texto já está formatado
    const hasPrefix = selectedText.startsWith(prefix);
    const hasSuffix = selectedText.endsWith(suffix);

    let formattedText: string;
    let newEnd = trimmedEnd;

    if (hasPrefix && hasSuffix) {
      // Remover a formatação se já estiver aplicada
      formattedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
      newEnd = trimmedEnd - prefix.length - suffix.length;
    } else {
      // Adicionar a formatação se não estiver aplicada
      formattedText = `${prefix}${selectedText}${suffix}`;
      newEnd = trimmedEnd + prefix.length + suffix.length;
    }

    // Atualizar o valor do textarea
    this.markdownText =
      textarea.value.substring(0, trimmedStart) +
      formattedText +
      textarea.value.substring(trimmedEnd);

    // Reposicionar o cursor e manter a seleção com os caracteres especiais incluídos
    setTimeout(() => {
      const newCursorPosition = start + prefix.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPosition);
      const textAfter = textarea.value.substring(cursorPosition);

      const currentLineStart = textBefore.lastIndexOf('\n') + 1;
      const currentLineText = textBefore.substring(currentLineStart);

      if (currentLineText.trim().startsWith('-')) {
        event.preventDefault();  // Impede a quebra de linha padrão
        const newLine = '\n- ';

        // Atualiza o conteúdo do textarea
        this.markdownText =
          textBefore + newLine + textAfter;

        // Reposiciona o cursor após o novo marcador
        setTimeout(() => {
          textarea.setSelectionRange(cursorPosition + newLine.length, cursorPosition + newLine.length);
        });
      }
    }
  }

  // Função para processar emojis
  processMarkdownWithEmojis(text: string): string {
    return emojione.toImage(text);
  }

  saveMarkdown() {
    const title = this.extractTitle(this.markdownText);

    if (this.editingItemIndex !== null) {
      // Atualiza item existente
      this.savedItemsService.updateItem(this.editingItemIndex, {
        title,
        content: this.markdownText,
      });
    } else {
      // Adiciona um novo item
      this.savedItemsService.addItem({ title, content: this.markdownText });
    }

    // Limpa o textarea e reseta o editor
    this.resetEditor();
  }

  // Extrai o título do markdown (primeira linha como título)
  private extractTitle(markdown: string): string {
    const lines = markdown.split('\n');
    return lines[0]?.startsWith('#') ? lines[0].replace('#', '').trim() : 'Sem título';
  }

  cancelUpdate() {
    // Redefinir o índice de edição
    this.editingItemIndex = null;

    // Limpar o texto do markdown para iniciar um novo
    this.markdownText = '';

    // Certificar-se de que a edição está ativa
    this.isEditing = true; // Mantenha o modo de edição

    // Se você tem um método para alternar estados, pode ser desnecessário
    // this.toggleEdit(); // Use apenas se necessário para alternar o estado de edição
  }




  viewItem(item: { title: string; content: string }, index: number) {
    this.markdownText = item.content;
    this.editingItemIndex = index;
    this.isEditing = false;
    this.mode = 'preview';
  }

  // Habilita a edição do item
  enableEditing() {
    this.isEditing = true;
    this.mode = 'edit';
  }

  // Função para voltar ao modo de edição
  toggleEdit() {
    this.isEditing = true;
  }

  // Cancela a edição de um item existente
  cancelEdit() {
    if (this.editingItemIndex !== null) {
      // Restaura o conteúdo original
      this.markdownText = this.originalMarkdownText;
      this.isEditing = false;
      this.mode = 'preview';
    } else {
      // Se não estava editando um item existente, reseta o editor
      this.resetEditor();
    }
  }

  // Volta para o estado inicial
  goBackToStart() {
    this.resetEditor();
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

  // Funções relacionadas à seleção de tabelas
  toggleSelector() {
    this.showSelector = !this.showSelector;
  }

  hideSelector() {
    this.showSelector = false;
  }

  highlightCells(rows: number, cols: number) {
    this.selectedRows = rows;
    this.selectedCols = cols;
  }

  insertTable(rows: number, cols: number) {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let tableTemplate = '';

    // Cabeçalho da tabela
    tableTemplate += '|' + '   |'.repeat(cols) + '\n';
    tableTemplate += '|' + '---|'.repeat(cols) + '\n';

    // Linhas da tabela
    for (let i = 0; i < rows; i++) {
      tableTemplate += '|' + '   |'.repeat(cols) + '\n';
    }

    const currentText = textarea.value;
    this.markdownText =
      currentText.substring(0, start) +
      tableTemplate +
      currentText.substring(end);

    textarea.focus();
    textarea.setSelectionRange(
      start + tableTemplate.length,
      start + tableTemplate.length
    );

    this.hideSelector(); // Esconde a grade após inserir
  }
}
