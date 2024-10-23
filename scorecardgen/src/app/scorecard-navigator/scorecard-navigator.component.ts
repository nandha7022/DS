import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CoreConfigService} from "../core-config.service";
@Component({
  selector: 'app-scorecard-navigator',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './scorecard-navigator.component.html',
  styleUrl: './scorecard-navigator.component.css'
})
export class ScorecardNavigatorComponent {
  eventId: any;
  constructor(private router: Router ,private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}
  error!: any;
  TeamsInfo!: any;
  JudegsInfo!: any;
  Judgeid: string = '';
  Teamid: string = '';
  inputText: string = '';
  TokenId!:string;
  responseData!:any;
  isTokenValid:Boolean=false;
  hasValidated = false;
  dropdown1Options: string[] = ['Select Option 1', 'Option 1', 'Option 2'];
  dropdown2Options: string[] = ['Select Option 2', 'Option 3', 'Option 4'];
  selectedCategories: string[] = ['Tap', 'Hip-Hop', 'Jazz'];
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  category!: string;
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
    const url = this.configService.getBaseUrl()+'/getEvent/';

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
        this.selectedCategories = response["eventCategory"];
       // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.error = error.message || 'An error occurred'; // Set error message
      }
    );

   const urlForteamsJudges = `https://competationhoster.azurewebsites.net/getTeamsJudges/${this.eventId}`;
   this.http.get<any>(urlForteamsJudges).subscribe(
     (data) => {
       // Assign the received data to eventMetaData
       this.TeamsInfo = data[0].teamsInfo;
       this.JudegsInfo = data[0].JudegsInfo;
       console.info('TeamsInfo ', this.TeamsInfo);
       console.info('JudegsInfo: ',  this.JudegsInfo);
     },
     (error) => {
       console.error('Error fetching data:', error);
     }
   );






  }

  ValidateAccessTokens():void{
    const judgesData ={
      EventId:this.eventId,
      judgeId:this.Judgeid,
      TokenId:this.TokenId
  }
   const jsonData = JSON.stringify(judgesData);
  const url = this.configService.getBaseUrl()+'/validateJudgeAccessToken';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.isTokenValid=response['validation']
        this.hasValidated=response['validation']
        this.responseData = response; // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.hasValidated=false
        this.error = error.message || 'An error occurred'; // Set error message
      }
    );
      console.log(jsonData);


  }

  onChangeJudge() {
    this.hasValidated = false;
    this.TokenId='' // Reset validation on dropdown change
  }
  NavigateToScoreCards(): void {
    console.log("judge id {} ", this.Judgeid);
    const navigationExtras: NavigationExtras = {
        queryParams: { eventId: this.eventId, judgeId: this.Judgeid },
        state: { someOtherData: 'value' } // Optionally pass additional data
    };

    // Construct the URL manually
    const url = this.router.createUrlTree(['score'], navigationExtras).toString();
    const baseUrl = window.location.origin; // Get the base URL of the application
    const fullUrl = `${baseUrl}${url}`;

    // Open the URL in a new tab
    window.open(fullUrl, '_blank');
}

isValidated(){
  return this.hasValidated;
}
}
