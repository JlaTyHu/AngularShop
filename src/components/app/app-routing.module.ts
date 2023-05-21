import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageType } from 'src/enums/page.enum';
import { AuthGuard } from 'src/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/all-goods',
    pathMatch: 'full'
  },
  {
    path: 'all-goods',
    loadComponent: () => import('../goods/goods.component')
      .then(module => module.GoodsComponent),
    data: { pageType: PageType.AllGoodsComponent }
  },
  {
    path: 'my-goods',
    canActivate: [AuthGuard],
    loadComponent: () => import('../goods/goods.component')
      .then(module => module.GoodsComponent),
    data: { pageType: PageType.MyGoodsComponent }
  },
  {
    path: '**',
    redirectTo: '/all-goods',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
