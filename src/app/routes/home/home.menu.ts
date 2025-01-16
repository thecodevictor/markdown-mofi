import { Menu } from "../../shared/services/interface/menu.interface"

export let MENUHOME: Menu[] = [
  {
    allowed: true,
    headTitle1: 'Home',
  },
  {
    level: 1,
    title: "Markdown",
    icon: 'home',
    type: "link",
    path: "/markdown/",
    allowed: true,
  },
]
