import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultV1Model } from 'src/app/_core/models/result-v1.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

export class TratamentoErrosHttpErrorResponseService {
  /**
   * Trata um erro HTTP e exibe um alerta com as mensagens de erro apropriadas.
   * 
   * @param err - O objeto de erro HttpErrorResponse.
   * 
   * Verifica se o erro é um erro de autenticação (401) ou de requisição inválida (400)
   * e exibe um alerta com as mensagens de erro retornadas no corpo da resposta.
   * Caso contrário, exibe um alerta com uma mensagem genérica de erro.
   * 
   * @see https://angular.io/api/common/http/HttpErrorResponse
   */
  public static tratarErro(err: HttpErrorResponse) {
    console.log('err')
    console.log(err)

    const erro: ResultV1Model = err.error;
    let mensagem = '';
    let titulo = '';

    if (typeof (erro.error) === 'string') {
      /**Caso tenha somente uma mensagem de erro */
      if(erro.message!){
        titulo = erro.error;
        mensagem = erro.message;
      }else{
        mensagem = erro.error;
      }
    } else if (Array.isArray(erro.error)) {
      /**Caso tenha um array com as mensagens de erro */
      mensagem = erro.error.map((e: { msg: string }) => e.msg).join('\n');
    } else {
      mensagem = 'Não foi possível concluir sua solicitação. Tente novamente mais tarde.'
    }

    if (err.status === 404) {
      /** Not Found */
      return Swal.fire(
        'Erro na comunicação.',
        'Ocorreu um erro na tentativa de comunicar com o servidor. Rota para realizar a solicitação não localizada.',
        'error'
      );
    } else if (err.status === 500) {
      /** Internal Server Error */
      return Swal.fire(
        'Erro no servidor.',
        'No momento estamos com uma inconsistência no servidor. Tente novamente mais tarde.',
        'error'
      );
    } else if (err.status === 400) {
      /** Bad Request */
      return Swal.fire(
        erro.titulo, 
        mensagem, 
        'error'
      );
    } else if (err.status === 401) {
      /** Unauthorized */
      return Swal.fire(
        'Acesso não autorizado!',
        'Ops, você não tem autorização para concluir esta solicitação.',
        'warning'
      );
    } else if (err.status === 504) {
      /** Gateway Time-out */
      return Swal.fire(
        'Solicitação em andamento!',
        'Pedimos que aguarde. Este processo pode levar um tempo para ser finalizado.',
        'info'
      );
    } else if(mensagem!){
      return Swal.fire(
        titulo! ? titulo : erro.titulo, 
        mensagem, 
        'error'
      );
    } else {
      return Swal.fire(
        'Algo deu errado!',
        'Ops, algo deu errado durante a requisição. Tente novamente mais tarde.',
        'error'
      );
    }
  }
}

/**
 * Classe responsável por tratar erros e mensagens de sucesso provenientes de respostas HTTP.
 */
export class TratamentoErrosSerpro {
  /**
   * Trata um erro HTTP e exibe um alerta com as mensagens de erro apropriadas.
   * 
   * @param err - O modelo de resultado contendo os dados do erro.
   */
  public static tratarErro(err: ResultV1Model) {
    console.log('err');
    console.log(err);
    let mensagens = '';

    if (err.error) {
      if (err.error.code && err.error.description) {
        mensagens = err.error.description;
      } else {
        err.error.mensagens.forEach((msg: any) => mensagens += msg.texto);
      }
    } else {
      const arrayMensagens: { codigo: string, texto: string }[] = err.data.mensagens;
      arrayMensagens.forEach(msg => mensagens += msg.texto);
    }

    if (mensagens) {
      Swal.fire(
        err.titulo,
        mensagens,
        'error'
      );
    } else if (err.error.status === 404) {
      // Not Found
      Swal.fire(
        'Erro na comunicação.',
        'Ocorreu um erro na tentativa de comunicar com o servidor. Rota para realizar a solicitação não localizada.',
        'error'
      );
    } else if (err.error.status === 500) {
      // Internal Server Error
      Swal.fire(
        'Erro no servidor.',
        'No momento estamos com uma inconsistência no servidor. Tente novamente mais tarde.',
        'error'
      );
    } else if (err.error.status === 400) {
      // Bad Request
      Swal.fire(
        err.titulo,
        mensagens,
        'error'
      );
    } else if (err.error.status === 401) {
      // Unauthorized
      Swal.fire(
        'Acesso não autorizado!',
        'Ops, você não tem autorização para concluir esta solicitação.',
        'error'
      );
    } else {
      Swal.fire(
        'Algo deu errado!',
        'Ops, algo deu errado durante a requisição. Tente novamente mais tarde.',
        'error'
      );
    }
  }

  /**
   * Trata mensagens de sucesso e exibe um alerta informativo.
   * 
   * @param resultado - O modelo de resultado contendo as mensagens de sucesso.
   */
  public static tratarSucessoMensagens(resultado: ResultV1Model) {
    let mensagens = '';
    resultado.data.mensagens.forEach((msg: any) => mensagens += msg.texto);

    if (mensagens) {
      Swal.fire(
        resultado.titulo,
        mensagens,
        'info'
      );
    }
  }
}

export class TratamentoErrosLoginClienteContabilidade {
  /**
   * Trata mensagens de erro e exibe um alerta informativo.
   * 
   * @param err - O objeto de erro HttpErrorResponse.
   * 
   * Verifica se o erro é um erro de autenticação (401) ou de requisição inválida (400)
   * e exibe um alerta com as mensagens de erro retornadas no corpo da resposta.
   * Caso contrário, exibe um alerta com uma mensagem genérica de erro.
   * 
   * @see https://angular.io/api/common/http/HttpErrorResponse
   */
  public static tratarErro(err: HttpErrorResponse) {
    console.log('err')
    console.log(err)
    const errorResultV1Model: ResultV1Model = err.error;

    if (errorResultV1Model && (err.status == 401 || err.status == 400)) {
      if (errorResultV1Model.error) {
        Swal.fire(
          errorResultV1Model.titulo,
          errorResultV1Model.message,
          'error'
        );
      }
    } else if (err.status === 500) {
      //Internal Server Error
      Swal.fire(
        'Erro no servidor.',
        'No momento estamos com uma inconsistência no servidor. Tente novamente mais tarde.',
        'error'
      );
    } else if (err.error.status === 404) {
      //Unauthorized
      Swal.fire(
        'Rota não localizada!',
        'Verifique o endpoint informado e tente novamente.',
        'error'
      );
    } else {
      Swal.fire(
        'Algo deu errado!',
        'Ops, algo deu errado durante a requisição. Tente novamente mais tarde.',
        'error'
      );
    }
  }
}