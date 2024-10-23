import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreConfigService {

  constructor() { }

  private readonly baseUrl: string = '';

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
