import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { PageType } from 'src/enums/page.enum';
import { AuthGuard } from 'src/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'user-profile/:id',
    component: UserProfileComponent,
    loadChildren: () => import('../user-profile/user-profile.module')
      .then(module => module.UserProfileModule)
  },
  {
    path: 'home',
    loadComponent: () => import('../home-page/home.component')
      .then(module => module.HomeComponent)
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
    redirectTo: '/home',
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
