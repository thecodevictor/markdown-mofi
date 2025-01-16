import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TratamentoErrosHttpErrorResponseService } from 'src/app/shared/services/tratamento-erros.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ComunicacaoApiDatasIndisponiveisV1Service } from 'src/app/routes/reservas/datas-indisponiveis/services/comunicacao-api-datas-indisponiveis-v1.service';
import { DatasIndisponiveisV1Model } from 'src/app/routes/reservas/datas-indisponiveis/models/datas-indisponiveis-v1.model';
import { DatasIndisponiveisV1Dto } from 'src/app/routes/reservas/datas-indisponiveis/models/datas-indisponiveis-v1-dto';
import { MensagemToastrService } from 'src/app/shared/services/mensagem-toastr.service';

@Component({
  selector: 'app-table-row-datas-indisponiveis',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table-row-datas-indisponiveis.component.html',
  styles: ``
})
export class TableRowDatasIndisponiveisComponent implements OnChanges {
  @Input() listaDatas: string[] = [];
  datasIndisponiveis: DatasIndisponiveisV1Model[] = [];

  constructor(
    private loaderService: LoaderService,
    private comunicacaoComApi: ComunicacaoApiDatasIndisponiveisV1Service,
    private mensagemToastrService: MensagemToastrService
  ) { }


  ngOnChanges(): void {
    this.getDatasIndisponiveis();
  }

  /**
   * Função chamada quando o mouse passa por cima de uma data no `templateDatasIndisponiveis`.
   * Se o mouse estiver em cima da data add a classe "bg-secondary-subtle" para dá o efeito de 'hover'.
   * Caso contrário, remove a classe.
   * @param dia A data no formato "YYYY-MM-DD"
   */
  onMouseMoveDtIndisponivel(dia: string) {
    const diaNumber = parseInt(dia.slice(8, 10));
    const element = document.getElementById('dia-' + diaNumber);

    if (element?.classList.contains('bg-secondary-subtle')) {
      element.classList.remove('bg-secondary-subtle');
    }
    else {
      element?.classList.add('bg-secondary-subtle');
    }
  }

  /**
   * Função chamada quando o componente é inicializado.
   * Faz a requisição para obter as datas indisponíveis 
   * e armazena o resultado na variável `datasIndisponiveis`.
   * @param isLoaderInicial  Se True não será alterado o loader neste componente,
   *                         e False para iniciar o loader ao indisponibilizar ou disponibilizar
   *                         uma data direto no mapa diário
   * @returns {Promise<void>}
   */
  async getDatasIndisponiveis(isLoaderInicial: boolean = true): Promise<void> {
    if (!isLoaderInicial) {
      // Inicia o loader
      this.loaderService.startLoader();
    }

    // Faz a requisição para obter as datas indisponíveis
    try {
      // Zera a lista de datas indisponíveis
      this.datasIndisponiveis = [];

      // Faz a requisição para obter as datas indisponíveis
      const resultado = await lastValueFrom(this.comunicacaoComApi.getAllDatas());

      // Verifica se a requisição foi bem sucedida
      if (resultado.success) {
        // Itera sobre o resultado e adiciona as datas indisponíveis na variável `datasIndisponiveis`
        Object.keys(resultado.data).forEach((key) => {
          if (resultado.data[key].length > 0) {
            resultado.data[key].forEach((element: DatasIndisponiveisV1Model) => {
              this.datasIndisponiveis.push(element);
            });
          }
        });
      }

      if (!isLoaderInicial) {
        // Para o loader
        this.loaderService.stopLoader();
      }

    } catch (err: HttpErrorResponse | any) {
      // Verifica se o erro é um erro HTTP
      if (err instanceof HttpErrorResponse) {
        // Trata o erro
        TratamentoErrosHttpErrorResponseService.tratarErro(err);
      } else {
        // Mostra o erro
        console.log('error', err);
      }

      if (!isLoaderInicial) {
        // Para o loader
        this.loaderService.stopLoader();
      }
    }
  }


  /**
   * Verifica se a data informada está indisponível.
   * @param data A data no formato "YYYY-MM-DD"
   * @returns {boolean} true se a data estiver indisponível, false caso contrário
   */
  verificarSeDataEstaIndisponivel(data: string): boolean {
    return this.datasIndisponiveis.some((dataIndisponivel) => dataIndisponivel.data.slice(0, 10) === data);
  }


  /**
   * Função para disponibilizar ou indisponibilizar uma data.
   * @param data A data no formato "YYYY-MM-DD"
   * @param acao true para disponibilizar, false para indisponibilizar
   */
  async disponibilizarOuIndisponibilizarData(data: string, acao: boolean) {
    try {
      const parametro: DatasIndisponiveisV1Dto = {
        _id: acao ? this.datasIndisponiveis.find((item) => item.data.slice(0, 10) === data)!._id : '',
        datasIndisp: [{ data: new Date(data) }],
      }
      const resultado = await lastValueFrom(this.comunicacaoComApi.disponibilizarOrIndisponibilizarData(!acao, parametro));
      if (resultado.success) {
        // Atualiza a lista de datas indisponíveis
        await this.getDatasIndisponiveis(false);

        // Mostra uma mensagem de sucesso
        this.mensagemToastrService.show(resultado.message, resultado.titulo, "success");
      } else {
        // Mostra uma mensagem de erro
        this.mensagemToastrService.show("Algo deu errado.", "Tente Novamente", "error");
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        TratamentoErrosHttpErrorResponseService.tratarErro(error);
      } else {
        console.log('error')
        console.log(error)
      }
    }
  }
}
