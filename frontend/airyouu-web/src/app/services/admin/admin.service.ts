import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SERVER } from '../NETWORK_CONSTS';
import { SnackbarService } from './../snackbar/snackbar.service';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  adminToken: string =
    'Bearer ' + localStorage.getItem('@airyouu/admin-token') || '';
  profile: Profile<Admin> | null = JSON.parse(
    localStorage.getItem('@airyouu/admin-profile') || '{}'
  );
  constructor(private http: HttpClient, private snackbar: SnackbarService) {
    const adminToken = localStorage.getItem('@airyouu/admin-token') || '';
  }
  LogOut() {
    localStorage.removeItem('@airyouu/admin-token');
    localStorage.removeItem('@airyouu/admin-profile');
  }
  Login(data: AuthData): Observable<ServerRes<AuthRes<Admin>>> {
    return this.http
      .post<ServerRes<AuthRes<Admin>>>(SERVER.API + 'auth/admin/login', data)
      .pipe(
        tap(
          (res) => {
            if (res.success) {
              localStorage.setItem('@airyouu/admin-token', res.data.token);
              localStorage.setItem(
                '@airyouu/admin-profile',
                JSON.stringify(res.data.profile)
              );
              this.adminToken = 'Bearer ' + res.data.token;
              this.profile = res.data.profile;
              this.snackbar.showSuccess('Login successfull, welcome.', 'X');
            } else {
              this.snackbar.showError('error', 'X');
            }
          },
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }

  GetAdmins(): Observable<ServerRes<Profile<Admin>[]>> {
    return this.http
      .get<ServerRes<Profile<Admin>[]>>(SERVER.API + 'admin/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {},
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  GetAdmin(id: string): Observable<ServerRes<Profile<Admin>>> {
    return this.http
      .get<ServerRes<Profile<Admin>>>(SERVER.API + 'admin/' + id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {},
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  GetUsers(): Observable<ServerRes<Profile<User>[]>> {
    return this.http
      .get<ServerRes<Profile<User>[]>>(SERVER.API + 'admin/user/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {},
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  CreateDelivery(p: Package): Observable<ServerRes<Package>> {
    return this.http
      .post<ServerRes<Package>>(SERVER.API + 'admin/delivery/new', p, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {
            this.snackbar.showSuccess(
              'New Delviery created successfully.',
              'X'
            );
          },
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  GetPackages(): Observable<ServerRes<Package[]>> {
    return this.http
      .get<ServerRes<Package[]>>(SERVER.API + 'admin/delivery/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {
            console.log('res', res);
          },
          (error) => {
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  GetPackage(id: string): Observable<ServerRes<Package>> {
    return this.http
      .get<ServerRes<Package>>(SERVER.API + 'admin/delivery/' + id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {},
          (error) => {
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  UpdatePackage(p: Package): Observable<ServerRes<Package>> {
    return this.http
      .post<ServerRes<Package>>(SERVER.API + 'admin/delivery/update', p, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {
            this.snackbar.showSuccess('Package updated successfully.', 'X');
          },
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
  UpdatePoint(p: Point): Observable<ServerRes<Point>> {
    return this.http
      .post<ServerRes<Point>>(SERVER.API + 'admin/delivery/update-point', p, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.adminToken,
        },
      })
      .pipe(
        tap(
          (res) => {
            this.snackbar.showSuccess(
              'Package route updated successfully.',
              'X'
            );
          },
          (error) => {
            console.log('error', error);
            this.snackbar.showError(
              error.error ? error.error.msg : 'Some kind of error occured.',
              'X'
            );
          }
        )
      );
  }
}
