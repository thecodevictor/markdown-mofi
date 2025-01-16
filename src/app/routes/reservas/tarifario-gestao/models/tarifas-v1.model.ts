import { TipoUhV1Model } from "./tipo-uh-v1.model";

export interface TarifasV1Model {
  _id?: string;
  tipoUh?: TipoUhV1Model;
  isPadrao?: boolean;
  isDomingoAQuinta?: boolean;
  isQuintaADomingo?: boolean;
  isAltaTemporadaEFeriados?: boolean;
  valorPensaoCafeManha?: {
    'simples'?: number;
    'duplo'?: number;
    'triplo'?: number;
    'quadruplo'?: number;
    'quintuplo'?: number;
    'crianca1'?: number;
    'crianca2'?: number;
    'adicional'?: number;
  };
  valorMeiaPensaoAlmoco?: {
    'simples'?: number;
    'duplo'?: number;
    'triplo'?: number;
    'quadruplo'?: number;
    'quintuplo'?: number;
    'crianca1'?: number;
    'crianca2'?: number;
    'adicional'?: number;
  };
  valorMeiaPensaoJantar?: {
    'simples'?: number;
    'duplo'?: number;
    'triplo'?: number;
    'quadruplo'?: number;
    'quintuplo'?: number;
    'crianca1'?: number;
    'crianca2'?: number;
    'adicional'?: number;
  };
  valorPensaoCompleta?: {
    'simples'?: number;
    'duplo'?: number;
    'triplo'?: number;
    'quadruplo'?: number;
    'quintuplo'?: number;
    'crianca1'?: number;
    'crianca2'?: number;
    'adicional'?: number;
  };
  _idTarifario?: string;
}
