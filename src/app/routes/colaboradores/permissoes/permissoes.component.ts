import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ComunicacaoApiPermissoesV1Service } from './services/comunicacao-api-permissoes-v1.service';
import { Subject, takeUntil } from 'rxjs';
import { TabelaPerfisPermissaoComponent } from './components/tabela-perfis-permissao/tabela-perfis-permissao.component';
import { ComunicacaoComponentesPermissoesService } from './services/comunicacao-componentes-permissoes.service';
import { FormPerfilPermissaoComponent } from './components/form-perfil-permissao/form-perfil-permissao.component';
import { RulesAccountV1Model } from './models/rules-account-v1.model';

@Component({
  selector: 'app-permissoes',
  standalone: true,
  imports: [
    CommonModule,
    TabelaPerfisPermissaoComponent,
    FormPerfilPermissaoComponent
  ],
  providers: [
    ComunicacaoApiPermissoesV1Service,
    ComunicacaoComponentesPermissoesService
  ],
  templateUrl: './permissoes.component.html',
})
export class PermissoesComponent implements OnDestroy {
  isVisualizandoListaPerfis: boolean;
  isCriandoEditandoPerfilPermissao: boolean;
  acaoSendoRealizadaString: string;
  permissaoSelecionada?: RulesAccountV1Model;
  $unsubscribe = new Subject<void>();

  constructor(
    public comunicacaoEntreComponentes: ComunicacaoComponentesPermissoesService
  ) {
    comunicacaoEntreComponentes.acaoSendoRealizada
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(acao => {
        this.acaoSendoRealizadaString = acao;
        this.isVisualizandoListaPerfis = acao === 'lista';
        this.isCriandoEditandoPerfilPermissao = acao === 'cadastro' || acao === 'edicao';
      })
    this.comunicacaoEntreComponentes.permissaoSelecionada
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        permissao => {
          this.permissaoSelecionada = permissao
        }
      );
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  /**
   * Obtém o título para o formulário com base na ação sendo realizada atualmente.
   * @returns {string} O título para o formulário.
   */
  get tituloFormulario() {
    switch (this.acaoSendoRealizadaString) {
      case 'cadastro':
        // Quando está criando um perfil de permissão
        return 'Criar Perfil de Permissão';
      case 'edicao':
        // Quando está editando um perfil de permissão
        return `Editar ${this.permissaoSelecionada?.namePerfil}`;
      default:
        // Caso padrão quando não há nenhuma ação específica sendo realizada
        return '';
    }
  }
}