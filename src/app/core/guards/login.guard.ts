import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export const loginGuard: CanActivateChildFn = (childRoute, state) => {
  const _snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('isLoggedIn');

  if (isLoggedIn) {
    return true;
  } else {
    _snackBar.open("Please log in first.", '', {
      duration: 3000,
      horizontalPosition: 'center',
      direction: "ltr"
    });
    router.navigate(['']);
    return false;
  }
};
