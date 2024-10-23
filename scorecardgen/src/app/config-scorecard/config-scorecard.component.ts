import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {CoreConfigService} from "../core-config.service";
interface CategoryParameters {
  category: string;
  parameters: ScoringParameter[];  // Array of scoring parameters for each category
}

interface ScoringParameter {
  name: string;
  maxScore: number;
  description: string;
}

@Component({
  selector: 'app-config-scorecard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './config-scorecard.component.html',
  styleUrl: './config-scorecard.component.css'
})
export class ConfigScorecardComponent {

// Separate scoring parameters for each category

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}

  eventId: any;
  error: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  EventData!:any;
  categoryList!:any;
  category!:any;
  scoringParameters: CategoryParameters[] = [];


  // Separate new parameter fields for each category
  newParameters: ScoringParameter[] = [];
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
        this.categoryList=response.eventCategory;
        this.scoringParameters=this.EventData["scorecardMeta"];
        console.log(this.scoringParameters);
        // Assign response to a variable to use in template
       this.newParameters = this.categoryList.map(() => ({ name: '', maxScore: 0, description: '' }));

      },
      (error) => {
        console.info('Error making POST request:', error);
      }
    );

  }

  // Add a new scoring parameter to the list
  addScoringParameter(categoryIndex: number, newParameter: ScoringParameter): void {
    if (newParameter.name && newParameter.maxScore > 0) {
      this.scoringParameters[categoryIndex].parameters.push({ ...newParameter });
      this.resetForm(categoryIndex);  // Reset the form after adding the parameter
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  // Remove scoring parameter from the specific category
  removeScoringParameter(categoryIndex: number, parameterIndex: number): void {
    this.scoringParameters[categoryIndex].parameters.splice(parameterIndex, 1);
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
  resetForm(categoryIndex: number): void {
    this.newParameters[categoryIndex] = { name: '', maxScore: 0, description: '' };
    this.errorMessage = '';
  }
}
