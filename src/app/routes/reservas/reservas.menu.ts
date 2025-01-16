import { Menu } from "../../shared/services/interface/menu.interface"

export let MENURESERVAS: Menu[] = [
  {
    allowed: true,
    headTitle1: 'Home',
  },
  {
    level: 1,
    allowed: true,
    path: "/dashboard/mapa-diario",
    title: "Mapa diário",
    icon: "home",
    type: "link",
  },
  {
    allowed: true,
    headTitle1: 'Reservas',
  },
  {
    level: 1,
    title: "Tarifário",
    icon: "calender",
    type: "sub",
    allowed: true,
    children: [
      { path: "/reservas/gestao-tarifario", title: "Gestão", type: "link" },
      { path: "/reservas/gestao-tarifario/uh", title: "Unidades Hoteleiras", type: "link" },
    ],
  },
  {
    level: 1,
    title: "Cupom",
    icon: "support-tickets",
    type: "sub",
    allowed: true,
    children: [
      { path: "/reservas/cupons/individual", title: "Individual", type: "link" },
      { path: "/reservas/cupons/promocional", title: "Promocional", type: "link" },
      { path: "/reservas/cupons/temporada", title: "Temporada", type: "link" }
    ],
  },
  {
    level: 1,
    allowed: true,
    path: "/reservas/promocoes",
    title: "Promoções",
    icon: "support-tickets",
    type: "link",
  },
  {
    level: 1,
    title: "Margem e Desconto",
    icon: "support-tickets",
    type: "sub",
    allowed: true,
    children: [
      { path: "/reservas/margem-e-desconto/disponibilidade-desconto", title: "Disponibilidade x Desconto", type: "link" },
      { path: "/reservas/margem-e-desconto/desconto-padrao", title: "Desconto padrão", type: "link" },
      { path: "/reservas/margem-e-desconto/ocupacao-padrao", title: "Ocupação padrão", type: "link" },
      { path: "/reservas/margem-e-desconto/desconto-diario", title: "Desconto diario", type: "link" },
      { path: "/reservas/margem-e-desconto/ocupacao-diaria", title: "Ocupação diario", type: "link" },
    ],
  },
  {
    level: 1,
    allowed: true,
    path: "/reservas/datas-indisponiveis",
    title: "Datas Indisponíveis",
    icon: "calender",
    type: "link",
  },
  {
    level: 1,
    allowed: true,
    path: "/reservas/limite-diarias",
    title: "Limite de Diárias",
    icon: "calender",
    type: "link",
  },
]
