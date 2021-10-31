import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  showError(message: string, action: string = 'X') {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
    });
  }
  showInfo(message: string, action: string = 'X') {
    this._snackBar.open(message, action, {});
  }
  showSuccess(message: string, action: string = 'X') {
    this._snackBar.open(message, action, { panelClass: ['green-snackbar'] });
  }
}
