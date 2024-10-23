import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {CoreConfigService} from "./core-config.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = this.configService.getBaseUrl()+'/authLoginDetails';
  private isAuthenticated = false;

  constructor(private http: HttpClient,private configService: CoreConfigService) {}

  login(Email: string, Password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, { Email, Password }).pipe(
      map(response => {
        response['UserName']=Email
        localStorage.setItem('UserProfile', JSON.stringify(response));
        localStorage.setItem('validation',response['validation']);
        localStorage.setItem('HostAccess',response['HostAccess']);
        localStorage.setItem('HostId',response['HostId']);
        localStorage.setItem('OwnerAccess',response['OwnerAccess']);
        localStorage.setItem('UserName',Email);
        console.log('UserProfile:', response);
        this.isAuthenticated = true;
        return true;
      }),
      catchError(error => {
        console.error('Login error:', error);
        localStorage.setItem('UserProfile', 'TestAccess');
        this.isAuthenticated = false;
        return of(false);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
