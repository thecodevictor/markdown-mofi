import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RulesColaboradorV1Model } from '../../models/rules-colaborador-v1.model';
import { Subject, takeUntil } from 'rxjs';
import { ComunicacaoComponentesPermissoesService } from '../../services/comunicacao-componentes-permissoes.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { RulesListaContasWeb, RulesMenuContasWeb, RulesNovoPerfil, RulesPerfisPermissoes } from '../../models/classes-utilizadas/rules-menu-contas-web.model';

@Component({
  selector: 'app-tab-permissoes-modulo-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule
  ],
  templateUrl: './tab-permissoes-modulo-colaboradores.component.html',
  styles: ``
})
export class TabPermissoesModuloColaboradoresComponent {
  permissoesADefinir: RulesColaboradorV1Model = new RulesColaboradorV1Model();
  $unsubscribe = new Subject<void>()

  constructor(
    private comunicacaoEntreComponentes: ComunicacaoComponentesPermissoesService,
  ) {
    this.comunicacaoEntreComponentes.permissoesDefinidasModuloColaborador
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(permissoes => {
        if (permissoes) {
          this.permissoesADefinir = permissoes;
        }
      });
  }

  /**
   * Método chamado quando o componente é destruído.
   * Realiza as seguintes ações:
   * 1. Emite um valor para o observable `$unsubscribe` para indicar que o componente foi destruído.
   * 2. Completa o observable `$unsubscribe` para evitar que ele continue emitindo valores.
   */
  ngOnDestroy(): void {
    // Emite um valor para o observable `$unsubscribe` para indicar que o componente foi destruído.
    this.$unsubscribe.next();

    // Completa o observable `$unsubscribe` para evitar que ele continue emitiindo valores.
    this.$unsubscribe.complete();
  }

  /**
   * Desmarca o menu "Contas Web" e seus sub-itens (Lista de Contas e Permissões)
   * quando o checkbox do menu é desmarcado.
   */
  desmarcarMenuContasWeb() {
    if (!this.permissoesADefinir.isContasWebMenu) {
      // Cria um novo objeto RulesMenuContasWeb com todas as propriedades
      // setadas como false.
      this.permissoesADefinir.contasWebMenu = new RulesMenuContasWeb();
    }
  }

  /**
   * Desmarca o submenu "Lista de Contas" e seus sub-itens (Novo Colaborador,
   * Visualizar Colaborador Excluído, Restaurar Colaborador Excluído) quando o
   * checkbox do submenu é desmarcado.
   */
  desmarcarSubMenuListaDeContas() {
    if (!this.permissoesADefinir.contasWebMenu.isListaContasWeb) {
      // Cria um novo objeto RulesListaContasWeb com todas as propriedades
      // setadas como false.
      this.permissoesADefinir.contasWebMenu.rulesListaContasWeb = new RulesListaContasWeb();
    }
  }

  /**
   * Desmarca o submenu "Permissões" e seus sub-itens (Novo Perfil, Ativar/Desativar Perfil,
   * Definir permissões no módulo Colaboradores, Definir permissões no módulo Reservas)
   * quando o checkbox do submenu é desmarcado.
   */
  desmarcarSubMenuPermissoes() {
    if (!this.permissoesADefinir.contasWebMenu.isPerfisPermissoes) {
      // Cria um novo objeto RulesPerfisPermissoes com todas as propriedades
      // setadas como false.
      this.permissoesADefinir.contasWebMenu.rulesPerfisPermissoes = new RulesPerfisPermissoes();

      // Cria um novo objeto RulesNovoPerfil com todas as propriedades
      // setadas como false.
      this.permissoesADefinir.contasWebMenu.rulesNovoPerfis = new RulesNovoPerfil();
    }
  }

  /**
   * Desmarca os checkboxes do submenu "Permissões" (Definir permissões no módulo Colaboradores, 
   * Definir permissões no módulo Reservas)
   * se o checkbox "Novo Perfil" for desmarcado.
   */
  desmarcarChecksModulosPermitidos() {
    // atribui à variável isNovoPerfil o valor do atributo rpp_isNewPerfilPermissao
    // entendi que se trata do mesmo atributo.
    this.permissoesADefinir.contasWebMenu.isNovoPerfil = this.permissoesADefinir.contasWebMenu.rulesPerfisPermissoes.rpp_isNewPerfilPermissao;

    // Se o checkbox "Novo Perfil" do submenu "Permissões" for desmarcado,
    // cria um novo objeto RulesNovoPerfil com todas as propriedades setadas
    // como false.
    if (!this.permissoesADefinir.contasWebMenu.rulesPerfisPermissoes.rpp_isNewPerfilPermissao) {
      this.permissoesADefinir.contasWebMenu.rulesNovoPerfis = new RulesNovoPerfil();
    }
  }
}
