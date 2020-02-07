import { AuthGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule'
  },
  {
    path: 'map',
    loadChildren: './commuter/map/map.module#MapPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: './commuter/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './commuter/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'driver/home',
    loadChildren: './driver/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'driver/ongoing-trips',
    loadChildren:
      './driver/ongoing-trips/ongoing-trips.module#OngoingTripsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ongoing-trips',
    loadChildren:
      './commuter/ongoing-trips/ongoing-trips.module#OngoingTripsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'trip-history',
    loadChildren:
      './common/trip-history/trip-history.module#TripHistoryPageModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
