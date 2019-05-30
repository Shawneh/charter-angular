import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RewardComponent } from './components/reward/reward.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'reward',
    pathMatch: 'full'
  },
  {
    path: 'reward',
    component: RewardComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
