import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = new HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  get(path: string, headers?: any): Observable<any> {
    return this.http.get(path, {headers: headers}).pipe(
      retry(0)
    );
  }

  post(path: string, body?: any, headers?: any): Observable<any> {
    return this.http.post(path, body, {headers: headers}).pipe(
      retry(0)
    );
  }

  patch(path: string, body?: any, headers?: any): Observable<any> {
    return this.http.patch(path, body, {headers: headers}).pipe(
      retry(0)
    );
  }

  put(path: string, body: any, headers?: any): Observable<any> {
    return this.http.put(path, body, {headers: headers}).pipe(
      retry(0)
    );
  }

  delete(path: string, headers?: any): Observable<any> {
    return this.http.delete(path, {headers: headers}).pipe(
      retry(0)
    );
  }
}
