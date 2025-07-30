import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['']);
  }
}
