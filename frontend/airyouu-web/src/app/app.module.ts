import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

//
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { AdminAuthComponent } from './components/admin/admin-auth/admin-auth.component';
import { AuthComponent } from './components/user/auth/auth.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import {
  AdminDeliveryDetailsComponent,
  NewItemModal,
  NewPointModal,
} from './components/admin/admin-delivery-details/admin-delivery-details.component';
import { DeliveryNewComponent } from './components/user/delivery-new/delivery-new.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { DeliveryListComponent } from './components/admin/delivery-list/delivery-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
//
import { AdminListComponent } from './components/admin/admin-list/admin-list.component';
import { AdminDetailsComponent } from './components/admin/admin-details/admin-details.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { DeliveryHistoryComponent } from './components/user/delivery-history/delivery-history.component';
import { DeliveryDetailsComponent } from './components/user/delivery-details/delivery-details.component';

//

@NgModule({
  declarations: [
    AppComponent,
    AdminAuthComponent,
    AuthComponent,
    DashboardComponent,
    DeliveryHistoryComponent,
    DeliveryDetailsComponent,
    DeliveryNewComponent,
    AdminOverviewComponent,
    DeliveryListComponent,
    AdminNavbarComponent,
    NavbarComponent,
    AdminComponent,
    UserComponent,
    LayoutComponent,
    AdminDashboardComponent,
    AdminListComponent,
    AdminDetailsComponent,
    UserDetailsComponent,
    UserListComponent,
    AdminDeliveryDetailsComponent,
    NewItemModal,
    NewPointModal,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
