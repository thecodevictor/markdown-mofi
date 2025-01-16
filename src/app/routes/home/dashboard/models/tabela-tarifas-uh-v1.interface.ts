export interface TabelaTarifasUhV1Interface {
  tipo: string;
  tarifas: {
    quarto: string;
    cafeManha: number;
    meiaPensao: number;
  }[]
}