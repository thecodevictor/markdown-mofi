import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'markdown',
    loadComponent: () => import('./markdown/markdown.component').then(m => m.MarkdownComponent),
    data: {
      title: "Markdown",
      breadcrumb: "Markdown",

    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
