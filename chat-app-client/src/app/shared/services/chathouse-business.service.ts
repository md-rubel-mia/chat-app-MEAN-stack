import { Injectable } from '@angular/core';
import  { MatSnackBar } from '@angular/material/snack-bar'
import { endsWith } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ChathouseBusinessService {

  constructor(private snackbar: MatSnackBar) { }

  showAlert(message: string) {
    this.snackbar.open(message, null, {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "end",
      panelClass: "custom-snackbar"
    });
  }
}
