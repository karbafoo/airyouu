import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { AdminAuthComponent } from './components/admin/admin-auth/admin-auth.component';
import { AuthComponent } from './components/user/auth/auth.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { AdminListComponent } from './components/admin/admin-list/admin-list.component';
import { AdminDetailsComponent } from './components/admin/admin-details/admin-details.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { DeliveryListComponent } from './components/admin/delivery-list/delivery-list.component';
import { AdminDeliveryDetailsComponent } from './components/admin/admin-delivery-details/admin-delivery-details.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { DeliveryHistoryComponent } from './components/user/delivery-history/delivery-history.component';
import { DeliveryDetailsComponent } from './components/user/delivery-details/delivery-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/user/auth',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          { path: 'auth', component: AdminAuthComponent },
          {
            path: 'dashboard',
            component: AdminDashboardComponent,
            children: [
              { path: '', component: AdminOverviewComponent },
              { path: 'admin/list', component: AdminListComponent },

              {
                path: 'admin/details/:adminId',
                component: AdminDetailsComponent,
                pathMatch: 'full',
              },
              { path: 'user/list', component: UserListComponent },
              { path: 'user/details', component: UserDetailsComponent },
              {
                path: 'delivery/list',
                component: DeliveryListComponent,
              },
              {
                path: 'delivery/details',
                component: AdminDeliveryDetailsComponent,
              },
              {
                path: 'delivery/details/:packageId',
                component: AdminDeliveryDetailsComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'user',
        component: UserComponent,
        children: [
          { path: 'auth', component: AuthComponent },
          {
            path: 'dashboard',
            component: DashboardComponent,
            children: [
              { path: '', redirectTo: 'delivery/list', pathMatch: 'full' },
              { path: 'delivery/list', component: DeliveryHistoryComponent },
              {
                path: 'delivery/details/:packageId',
                component: DeliveryDetailsComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
