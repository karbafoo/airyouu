import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER } from '../NETWORK_CONSTS';
import { SnackbarService } from './../snackbar/snackbar.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  token: string = 'Bearer ' + localStorage.getItem('@airyouu/token') || '';
  profile: Profile<User> | null = JSON.parse(
    localStorage.getItem('@airyouu/profile') || '{}'
  );
  constructor(private http: HttpClient, private snackbar: SnackbarService) {}

  LogOut() {
    localStorage.removeItem('@airyouu/token');
    localStorage.removeItem('@airyouu/profile');
  }
  Login(data: AuthData): Observable<ServerRes<AuthRes<User>>> {
    return this.http
      .post<ServerRes<AuthRes<User>>>(SERVER.API + 'auth/login', data)
      .pipe(
        tap(
          (res) => {
            if (res.success) {
              localStorage.setItem('@airyouu/token', res.data.token);
              localStorage.setItem(
                '@airyouu/profile',
                JSON.stringify(res.data.profile)
              );
              this.token = 'Bearer ' + res.data.token;
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

  SignUp(data: AuthData): Observable<ServerRes<AuthRes<Admin>>> {
    return this.http
      .post<ServerRes<AuthRes<Admin>>>(SERVER.API + 'auth/signup', data)
      .pipe(
        tap(
          (res) => {
            this.snackbar.showSuccess('Signup successfull', 'X');
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
      .get<ServerRes<Package[]>>(SERVER.API + 'user/packages', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token,
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

  GetPackage(id: string): Observable<ServerRes<Package>> {
    return this.http
      .get<ServerRes<Package>>(SERVER.API + 'user/packages/' + id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token,
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
}
