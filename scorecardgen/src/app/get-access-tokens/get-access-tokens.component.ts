import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationExtras, Router } from '@angular/router';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-get-access-tokens',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './get-access-tokens.component.html',
  styleUrl: './get-access-tokens.component.css'
})
export class GetAccessTokensComponent {
  eventId:string=''
  directionUrl:string='https://maps.app.goo.gl/4f42zLjafaXB6pg89'

  TokenDetails !:any;
  responseData!: Object;
  error!: any;
  TeamsInfo!: any;
  JudegsInfo!: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  constructor(private router: Router ,private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
     if (this.eventId) {
       // Use the eventId here, e.g., for data fetching or processing
       console.log('Retrieved eventId:', this.eventId);
       // Call a service to fetch data based on eventId (optional)
     } else {
       // Handle the case where 'eventId' is not present
       console.error('eventId parameter not found in query string.');
     }
   });
  this.loading=true;
   const url = this.configService.getBaseUrl()+'/getAccessTokens';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data ={
      EventId:this.eventId
    }
    const jsonData = JSON.stringify(data);
    // Make the POST request with the provided data
    this.http.post(url, jsonData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.TokenDetails = response;
        this.loading=false; // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.errorMessage = error.message || 'An error occurred.Please try Again';
        setTimeout(() => this.errorMessage=(null), 2000);
       // Set error message
      }
    );
    console.log(this.responseData);
  }


}
