import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CoreConfigService} from "../core-config.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = this.configService.getBaseUrl()+'';

  constructor(private http: HttpClient,private configService: CoreConfigService) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('EventType', "Event");
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
