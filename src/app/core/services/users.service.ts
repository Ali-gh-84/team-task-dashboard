import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private cachedUsers$: Observable<any[]> | null = null;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    if (!this.cachedUsers$) {
      this.cachedUsers$ = this.http.get<any[]>(environment.path).pipe(
        shareReplay(1),
        tap(users => console.log('Fetched from API:', users))
      );
    } else {
      console.log('Returned from cache');
    }

    return this.cachedUsers$;
  }

  clearCache(): void {
    this.cachedUsers$ = null;
  }
}
