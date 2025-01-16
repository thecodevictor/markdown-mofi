export const HOTEIS: DadosDoHotelSelecionadoV1Interface[] = [
  {
    nome: 'Hotel CTC',
    tituloInicial: 'do Hotel CTC',
    _idAccount: 'Pm8Ys2Es2F',
    urlLightIcon: 'assets/images/ctc//lg-ctc-dash.png',
    urlDarkIcon: 'assets/images/ctc/lg-ctc-dash.png',
    wrappedLogo: ''
  },
  {
    nome: 'Adtur - Clubes & Flats',
    tituloInicial: 'da Adtur',
    _idAccount: 'Yb8Bm1Re2N',
    urlLightIcon: 'assets/images/adtur/logo1.png',
    urlDarkIcon: 'assets/images/adtur/logo1.png',
    wrappedLogo: 'assets/images/adtur/logo1.png',
    primaryColor: '#f37d38',
    secondaryColor: '#5f0101'
  },
]

export interface DadosDoHotelSelecionadoV1Interface {
  nome: string;
  tituloInicial: string;
  _idAccount: string;
  urlLightIcon: string;
  urlDarkIcon: string;
  wrappedLogo: string;
  primaryColor?: string;
  secondaryColor?: string;
}
