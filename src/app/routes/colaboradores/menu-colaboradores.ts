import { Menu } from "../../shared/services/interface/menu.interface"

export let MENUCOLABORADORES: Menu[] = [
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
    level: 1,
    allowed: true,
    path: "/dashboard/tarifario",
    title: "Tarifário",
    icon: "home",
    type: "link",
  },
  {
    allowed: true,
    headTitle1: 'Usuários',
  },
  {
    level: 1,
    allowed: true,
    title: "Contas Web",
    icon: 'knowledgebase',
    type: "sub",
    children: [
      { path: "/colaboradores/meu-perfil", title: "Meu Perfil", type: "link" },
      { path: "/colaboradores/contas-web", title: "Lista de contas", type: "link" },
      { path: "/colaboradores/permissoes", title: "Permissões", type: "link" },
    ]
  },
]