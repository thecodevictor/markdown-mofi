import { DetalhesTipoUhV1Model } from "src/app/routes/home/dashboard/models/detalhes-tipo-uh-v1.model";

export interface MapaDispV1Model {
  data: Date;
  idHotel: number;
  hotel: string;
  mapaDiario: DetalhesTipoUhV1Model[];
  totalDispDia: number;
}