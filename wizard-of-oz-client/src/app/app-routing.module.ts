import {RouterModule, Routes, Router} from '@angular/router';
import {NgModule} from '@angular/core';

import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {DataService} from './service/data.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private dataService: DataService) {
    this.dataService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }
}
