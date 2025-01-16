import { Component, OnDestroy } from '@angular/core';
import { RulesDatasIndisponiveis, RulesLimiteDiarias, RulesPromocoes, RulesReservasV1Model } from '../../models/rules-reservas-v1.model';
import { ComunicacaoComponentesPermissoesService } from '../../services/comunicacao-componentes-permissoes.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RulesCupomIndividual, RulesCupomPromocional, RulesCupomTemporada, RulesMenuCupom } from '../../models/classes-utilizadas/rules-menu-cupom.model';
import { RulesMargemDescontoDiario, RulesMargemDescontoPadrao, RulesMargemDisponibilidadeDesconto, RulesMargemOcupacaoDiaria, RulesMargemOcupacaoPadrao, RulesMenuMargemDesconto } from '../../models/classes-utilizadas/rules-menu-margem-desconto.model';

@Component({
  selector: 'app-tab-permissoes-modulo-reservas',
  standalone: true,
  imports: [
    NgbAlertModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './tab-permissoes-modulo-reservas.component.html',
  styles: ``
})
export class TabPermissoesModuloReservasComponent implements OnDestroy {
  permissoesADefinir: RulesReservasV1Model = new RulesReservasV1Model();
  $unsubscribe = new Subject<void>();

  /**
   * Construtor da classe.
   * Realiza as seguintes ações:
   * 1. Recebe as permissões definidas para o módulo Reservas via observable 
   *  e as armazena na variável `permissoesADefinir`.
   * 2. Verifica se a ação que está sendo realizada é de cadastro 
   *  e redefine as permissões do módulo Reservas para os valores padrão.
   * @param comunicacaoEntreComponentes - Serviço responsável pela comunicação entre os componentes.
   */
  constructor(
    private comunicacaoEntreComponentes: ComunicacaoComponentesPermissoesService,
  ) {
    // Recebe as permissões definidas para o módulo Reservas via observable e as armazena na variável `permissoesADefinir`.
    this.comunicacaoEntreComponentes.permissoesDefinidasModuloReservas
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
   * Desmarca o menu "Cupons".
   * Se o menu "Cupons" for desmarcado, redefine todas as permissões relacionadas.
   */
  desmarcarMenuCupons() {
    // Verifica se o menu "Cupons" não está selecionado
    if (this.permissoesADefinir?.isMenuCupom) {
      // Redefine as permissões do menu "Cupons" para os valores padrão
      this.permissoesADefinir!.menuCupom = new RulesMenuCupom();
    }
  }

  /**
   * Redefine as permissões do submenu especificado no menu "Cupons".
   * @param subMenu - O tipo de submenu para redefinir.
   *    O valor pode ser:
   *    - 'individual': Submenu "Cupom Individual"
   *    - 'promocional': Submenu "Cupom Promocional"
   *    - 'temporada': Submenu "Cupom Temporada"
   */
  desmarcarSubMenuCupons(subMenu: 'individual' | 'promocional' | 'temporada') {
    switch (subMenu) {
      case 'individual':
        // Verifica se o submenu "Cupom Individual" está selecionado
        if (this.permissoesADefinir!.menuCupom!.isSubMenuCupomIndividual) {
          // Redefine as permissões do submenu "Cupom Individual" para os valores padrão
          this.permissoesADefinir!.menuCupom!.rulesCupomUnico = new RulesCupomIndividual()
        }
        break;
      case 'promocional':
        // Verifica se o submenu "Cupom Promocional" está selecionado
        if (this.permissoesADefinir!.menuCupom!.isSubMenuCupomPromocional) {
          // Redefine as permissões do submenu "Cupom Promocional" para os valores padrão
          this.permissoesADefinir!.menuCupom!.rulesCupomPromocional = new RulesCupomPromocional();
        }
        break;
      case 'temporada':
        // Verifica se o submenu "Cupom Temporada" está selecionado
        if (this.permissoesADefinir!.menuCupom!.isSubMenuCupomTemporada) {
          // Define todas as regras relacionadas ao cupom de temporada como falsas/valor default
          this.permissoesADefinir!.menuCupom!.rulesCupomTemporada = new RulesCupomTemporada();
        }
        break;
    }
  }

  /**
   * Desmarca o menu "Margem e Desconto".
   * Se o menu "Margem e Desconto" for desmarcado, redefine todas as permissões relacionadas.
   */
  desmarcarMenuMargemDesconto() {
    // Verifica se o menu "Margem e Desconto" está selecionado
    if (this.permissoesADefinir.isMenuMargemDesconto) {
      // Redefine as permissões do menu "Margem e Desconto" para os valores padrão
      this.permissoesADefinir.menuMargemDesconto = new RulesMenuMargemDesconto();
    }
  }

  /**
   * Redefine as permissões do submenu especificado no menu "Margem de Desconto".
   * @param subMenu - O tipo de submenu para redefinir. 
   *  Pode ser um dos:
    *  'dispDesc' | 'descontoDiario' | 'descontoPadrao' | 'ocupacaoDiaria' | 'ocupacaoPadrao'
   */
  desmarcarSubMenusMargem(subMenu: 'dispDesc' | 'descontoDiario' | 'descontoPadrao' | 'ocupacaoDiaria' | 'ocupacaoPadrao') {
    switch (subMenu) {
      case 'dispDesc':
        // Redefine as permissões para o submenu "Disponibilidade de Desconto"
        if (this.permissoesADefinir.menuMargemDesconto.isSubMenuDisponibilidadeDesconto) {
          this.permissoesADefinir.menuMargemDesconto.rulesMenuDisponibilidadeDesconto = new RulesMargemDisponibilidadeDesconto();
        }
        break;
      case 'descontoDiario':
        // Redefine as permissões para o submenu "Margem de Desconto Diário"
        if (this.permissoesADefinir.menuMargemDesconto.isSubMenuMargemDescontoDiario) {
          this.permissoesADefinir.menuMargemDesconto.rulesMargemDescontoDiario = new RulesMargemDescontoDiario();
        }
        break;
      case 'descontoPadrao':
        // Redefine as permissões para o submenu "Margem de Desconto Padrão"
        if (this.permissoesADefinir.menuMargemDesconto.isSubMenuMargemDescontoPadrao) {
          this.permissoesADefinir.menuMargemDesconto.rulesMargemDescontoPadrao = new RulesMargemDescontoPadrao();
        }
        break;
      case 'ocupacaoDiaria':
        // Redefine as permissões para o submenu "Ocupação Diária"
        if (this.permissoesADefinir.menuMargemDesconto.isSubMenuMargemOcupacaoDiario) {
          this.permissoesADefinir.menuMargemDesconto.rulesMargemOcupacaoDiario = new RulesMargemOcupacaoDiaria();
        }
        break;
      case 'ocupacaoPadrao':
        // Redefine as permissões para o submenu "Ocupação Padrão"
        if (this.permissoesADefinir.menuMargemDesconto.isSubMenuMargemOcupacaoPadrao) {
          this.permissoesADefinir.menuMargemDesconto.rulesMargemOcupacaoPadrao = new RulesMargemOcupacaoPadrao();
        }
        break;
    }
  }

  /**
   * Desmarca o menu de datas indisponiveis
   * Se o menu de datas indisponiveis estiver desmarcado, desmarca tambem todas as permissoes relacionadas
   */
  desmarcarMenuDatasIndisponiveis() {
    // Verifica se o menu de datas indisponiveis est  desmarcado
    if (this.permissoesADefinir!.isMenuDatasIndisponiveis) {
      // Define todas as regras relacionadas ao menu de datas indisponiveis como falsas
      this.permissoesADefinir!.menuDatasIndisponiveis = {
        rulesDatasIndisponiveis: new RulesDatasIndisponiveis()
      };
    }
  }

  /**
   * Desmarca o menu de promoções.
   * Se o menu de promoções estiver desmarcado, redefine todas as permissõees relacionadas 
   * para seus valores padrão.
   */
  desmarcarMenuPromocoes() {
    // Verifica se o menu de promoções está desmarcado
    if (this.permissoesADefinir!.isMenuPromocoes) {
      // Redefine todas as regras relacionadas ao menu de promoções para seus valores padrão
      this.permissoesADefinir!.menuPromocoes = {
        rulesPromocoes: new RulesPromocoes()
      };
    }
  }

  /**
   * Reseta o menu de limite de diárias.
   * Se o menu de limite de diárias estiver marcado, redefine todas as permissões relacionadas ao limite de diárias 
   * para seus valores padrões.
   */
  desmarcarMenuLimiteDiarias() {
    // Verifica se o menu de limite de diárias está marcado
    if (this.permissoesADefinir!.isMenuMinimoDiarias) {
      // Redefine todas as regras relacionadas ao limite de diárias
      this.permissoesADefinir!.menuMinimoDiarias = {
        rulesMinimoDiarias: new RulesLimiteDiarias()
      };
    }
  }
}
