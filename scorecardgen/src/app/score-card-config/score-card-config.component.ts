import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {CoreConfigService} from "../core-config.service";
interface ScoringParameter {
  name: string;
  maxScore: number;
  description: string;
}
@Component({
  selector: 'app-score-card-config',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './score-card-config.component.html',
  styleUrl: './score-card-config.component.css'
})
export class ScorecardConfigurationComponent {
  scoringParameters: ScoringParameter[] = [];
  newParameter: ScoringParameter = { name: '', maxScore: 0, description: '' };
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}

  eventId: any;
  error: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  EventData!:any;
  ngOnInit() {

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
    const url = this.configService.getBaseUrl()+'getEvent/';
     // Define the HTTP headers
     const headers = new HttpHeaders({
       'Content-Type': 'application/json'
     });
     const data ={
       EventId:this.eventId
     }
     const jsonData = JSON.stringify(data);
     // Make the POST request with the provided data
     this.http.post<any>(url, jsonData, { headers }).subscribe(
       (response) => {
         console.log('POST request successful:', response);
         this.EventData = response;
         this.scoringParameters=this.EventData["scorecardMeta"];
         console.log(this.scoringParameters);
       // Assign response to a variable to use in template
        // this.scoringParameters = this.EventData?.scorecardMeta || {};

       },
       (error) => {
         console.info('Error making POST request:', error);
       }
     );

  }

  // Add a new scoring parameter to the list
  addScoringParameter(): void {
    if (this.newParameter.name && this.newParameter.maxScore) {
      this.scoringParameters.push({ ...this.newParameter });
      this.resetForm();
    }
  }

  // Remove a scoring parameter from the list by index
  removeScoringParameter(index: number): void {
    this.scoringParameters.splice(index, 1);
  }

  // Save scoring parameters to the backend
  saveScoringParameters() {

      this.EventData['scorecardMeta']=this.scoringParameters;
      const url = this.configService.getBaseUrl()+'Updatecompetition';
    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data=this.EventData;
    console.log('data',data)
    const jsonData = JSON.stringify(data);
    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (responseDta) => {
        console.log('POST request successful:', responseDta);
       //this.ScoreCard = responseDta.scorecard;
       this.loading=false;
       this.successMessage = 'ScoreCard Details Saved';
       setTimeout(() => this.successMessage=(null), 2000);
        // Assign response to a variable to use in template
     },
     (error) => {
      this.loading=false;
       console.info('Error making POST request:', error);
       this.errorMessage = 'Error Occured  ';
       setTimeout(() => this.errorMessage=(null), 2000);
     }
    );

}


  // Reset the form after adding a parameter
  private resetForm(): void {
    this.newParameter = { name: '', maxScore: 0, description: '' };
  }
}
