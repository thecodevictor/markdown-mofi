import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AvatarV1Model } from 'src/app/_core/models/avatar-v1.model';
import { HeaderUserService } from 'src/app/_core/services/headeruser.service';
import { SecurityUtil } from 'src/app/_core/utils/security.util';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { ComunicandoEntreComponentesLoginService } from 'src/app/shared/services/comunicando-entre-componentes.service';
import { ComunicacaoApiGestaoMeuPerfilService } from '../../services/comunicacao-api-gestao-meu-perfil.service';
import { lastValueFrom, Subject } from 'rxjs';
import { ComunicacaoApiGestaoContasV1Service } from '../../services/comunicacao-api-gestao-contas-v1.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-avatar-meu-perfil',
  templateUrl: './avatar-meu-perfil.component.html',
  standalone: false
})

export class AvatarMeuPerfilComponent implements OnInit, OnDestroy {
  /**
   * variáveis de ambiente
  */
  $unsubscribe = new Subject<void>();
  active = 1;
  submitted = false;
  desabilitarBotaoEnviar: boolean = true;
  textoInformativo: string = 'Arquivos aceitados: JPEG, PNG, GIF, JPG. Tamanho máximo: 200KB';
  arquivoUploaded?: File;
  userLogado: AccountAccessV1Model | null;
  avataresFemininos: AvatarV1Model[] = [];
  avataresMasculinos: AvatarV1Model[] = [];
  avataresOutros: AvatarV1Model[] = [];

  @Output() retornarAosDetalhes: EventEmitter<ResultV1Model> = new EventEmitter();

  constructor(
    private loaderService: LoaderService,
    private headerService: HeaderUserService,
    private readonly comunicacaoApiGestaoMeuPerfil: ComunicacaoApiGestaoMeuPerfilService,
    private readonly comunicacaoApiGestaoContas: ComunicacaoApiGestaoContasV1Service,
    private comunicandoEntreComponentesLoginService: ComunicandoEntreComponentesLoginService,
    private mensagemToastrService: MensagemToastrService
  ) {
    this.userLogado = SecurityUtil.getAccount();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  ngOnInit(): void {
    this.loaderService.startLoader();
    this.getListaAvatares()
  }

  /**
   * Verifica se o arquivo selecionado pelo usuário está dentro do padrão de tamanho aceito
   * e altera o texto informativo para o usuário
   * @param event evento de mudança do input file
   */
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.arquivoUploaded = event.target.files[0];

      // Verifica se o tamanho do arquivo é maior que 200KB
      const spanEl = document.getElementById('texto-informativo');
      if (this.arquivoUploaded!.size > 200000) {
        // Caso sim, desabilita o botão de envio e altera o texto informativo
        this.desabilitarBotaoEnviar = true;
        this.textoInformativo = `Tamanho m ximo: 200KB. Tamanho do arquivo ${this.arquivoUploaded!.size / 1000}KB. Selecione outra imagem.`;
        spanEl?.classList.replace('text-muted', 'text-danger');
      } else {
        // Caso n o, habilita o botão de envio e altera o texto informativo
        this.desabilitarBotaoEnviar = false;
        this.textoInformativo = 'Arquivos aceitos: JPEG, PNG, GIF, JPG. Tamanho m ximo: 200KB.';
        spanEl?.classList.replace('text-danger', 'text-muted');
      }
    }
  }

  /**
   * Atualiza o avatar do usuário logado
   * @param item novo avatar a ser atualizado
   */
  async atualizarAvatar(item: AvatarV1Model) {
    this.loaderService.startLoader();
    try {
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoMeuPerfil.putUpdateAvatar(item)
      );

      if (resultado.success) {
        // Atualiza o avatar do usuário logado
        this.userLogado!._avatar = resultado.data._avatar;
        SecurityUtil.setAccount(this.userLogado!);

        // Emite evento para atualizar o header
        this.headerService.userAlterdoEvent();

        // Emite evento para atualizar o avatar em todos os componentes
        this.comunicandoEntreComponentesLoginService.atualizarAvatar();

        // Retorna o resultado para o componente pai
        this.retornarAosDetalhes.emit(resultado);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // Trata erros HTTP
        TratamentoErrosHttpErrorResponseService.tratarErro(error)
      } else {
        console.log('error')
        console.log(error)
      }
    }
  }

  /**
   * Envia imagem para servidor e atualiza avatar do colaborador
   */
  async enviarImagemPersonalizada() {
    this.loaderService.startLoader();

    const formData = new FormData();
    formData.append('file', this.arquivoUploaded!);
    try {
      // Envia o formData para o servidor
      const resultado = await lastValueFrom(
        this.comunicacaoApiGestaoMeuPerfil.putUploadAvatar(formData)
      );

      console.log()
      console.log(resultado)

      if (resultado.success) {
        // Atualiza avatar do colaborador
        this.userLogado!._avatar = resultado.data._avatar;
        SecurityUtil.setAccount(this.userLogado!);
        this.headerService.userAlterdoEvent();
        this.comunicandoEntreComponentesLoginService.atualizarAvatar();
        this.retornarAosDetalhes.emit(resultado);
      } else {
        this.mensagemToastrService.show(
          resultado.message,
          resultado.titulo,
          'error'
        )
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('Erro ao enviar imagem personalizada', error);
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Busca a lista de avatares disponíveis para o usuário.
   * Esta função faz uma chamada de API para recuperar avatares e
   * lida com os resultados ou quaisquer erros potenciais que ocorram durante o processo.
   */
  async getListaAvatares() {
    this.loaderService.startLoader();
    this.avataresFemininos = [];
    this.avataresMasculinos = [];
    this.avataresOutros = [];
    try {
      // Faz uma chamada de API para obter a lista de avatares
      const resultado = await lastValueFrom(this.comunicacaoApiGestaoContas.getListaAvatar());

      // Verifica se a chamada de API foi bem-sucedida
      if (resultado.success) {
        // Se bem-sucedida, atribui os dados à listaAvatares
        this.avataresFemininos = this.filtrarPorTipoDeAvatar(resultado.data, 'feminino');
        this.avataresMasculinos = this.filtrarPorTipoDeAvatar(resultado.data, 'masculino');
        this.avataresOutros = this.filtrarPorTipoDeAvatar(resultado.data, 'outros');
      }
    } catch (error) {
      // Trata erros que são instâncias de HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        // Registra quaisquer outros erros
        console.log('erro');
        console.log(error);
      }
    } finally {
      this.loaderService.stopLoader();
    }
  }

  /**
   * Filtra a lista completa de avatares por tipo de avatar.
   * @param listaCompleta A lista completa de avatares.
   * @param tipo O tipo de avatar a ser filtrado.
   * @returns Uma lista de avatares filtrados pelo tipo.
   */
  filtrarPorTipoDeAvatar(listaCompleta: AvatarV1Model[], tipo: string): AvatarV1Model[] {
    return listaCompleta.filter(e => e.type == tipo);
  }

  /**
   * Emite um evento para indicar que o retorno à visualização de detalhes foi solicitado.
   * Isso geralmente é chamado quando a alteração do avatar é cancelada.
   */
  voltarAosDetalhes() {
    // Emite um evento com um ResultV1Model para notificar que a alteração do avatar foi cancelada
    this.retornarAosDetalhes.emit(
      new ResultV1Model(
        false, // Indica falha ou cancelamento
        'Alteração do avatar cancelada.', // Mensagem descrevendo o resultado
        '', // Mensagem vazia para informações adicionais (não usada)
        null, // Nenhum dado está associado a este evento
        null  // Nenhum erro está associado a este evento
      )
    );
  }
}
