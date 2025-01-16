import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { MarkdownComponent } from './routes/home/markdown/markdown.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    loadChildren: () => import('./routes/home/home.module').then(m => m.HomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
