import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-lead-bord-screen',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './lead-bord-screen.component.html',
  styleUrl: './lead-bord-screen.component.css'
})
export class LeadBordScreenComponent {
  leaderboard: { [key: string]: Array<{ teamName: string; total_score: number }> } = {};
  eventId: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
     if (this.eventId) {
       // Use the eventId here, e.g., for data fetching or processing
       console.log('Retrieved eventId:', this.eventId);
       // Call a service to fetch data based on eventId (optional)
       const data ={
        EventId:this.eventId
       }
       const jsonData = JSON.stringify(data);
  const url = this.configService.getBaseUrl()+'/getleaderboard';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.leaderboard = response.leaderboard;
        // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        //this.error = error.message || 'An error occurred'; // Set error message
      }
    );

     } else {
       // Handle the case where 'eventId' is not present
       console.error('eventId parameter not found in query string.');
     }
   });

  }

}
