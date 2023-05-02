import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "../home-page/home.component";
import { AllGoodsComponent } from '../all-goods/all-goods.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('../home-page/home.component')
      .then(module => module.HomeComponent)
  },
  {
    path: 'all-goods',
    loadComponent: () => import('../all-goods/all-goods.component')
      .then(module => module.AllGoodsComponent)
  },
  {
    path: 'my-goods',
    loadComponent: () => import('../my-goods/my-goods.component')
      .then(module => module.MyGoodsComponent)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
