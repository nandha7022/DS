import { Component, OnInit } from '@angular/core';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ActivatedRoute, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { AuthGuard } from '../auth.guard';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-competation-details',
  templateUrl: './competation-details.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
  styleUrls: ['./competation-details.component.css']
})
export class CompetationDetailsComponent implements OnInit {
  eventId:string=''
  directionUrl:string='https://maps.app.goo.gl/4f42zLjafaXB6pg89'

  EventData !:any;
  EventDataTemp !:any;

  responseData!: Object;
  error!: any;
  TeamsInfo!: any;
  JudegsInfo!: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  isLive = false;
  isCompleted = false;
  profileData: any ;
  HostAccess: any ;
  conditions: string[] = [
    'Children below 5 years can enter for free.',
    'Outside food and beverages are not allowed.',
    'Entry tickets are non-refundable.',
    'The management reserves the right to admission.'
  ];
  CompetitionHighlights: string[] = [
    'Competition Opening ceremony at 09:45 am.',
    'Shopping at abcd '
  ];
  forEntryRules: string[] = [
    'Each ticket admits one person only.' ,
    'Children below 33" height will not be charged.' ,
    'The ticket is valid for the day of reservation. ' ,
    'Personal food, beverages, and bottled water are not allowed - except for diabetics and infants.' ,
    'The parking ticket is valid for one day; the vehicle parked is at the owner’s risk.'
  ];
   EventAboutSec!: any;
  constructor(private router: Router,private authService: AuthService ,private authGuard: AuthGuard,private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}

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
   this.profileData=localStorage.getItem('UserProfile')
   this.HostAccess=localStorage.getItem('HostAccess')
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
        this.EventData = response;
        this.EventAboutSec=this.EventData.EventAboutSec
        //this.EventDataTemp = { ...response };
        this.EventDataTemp = JSON.parse(JSON.stringify(response)); // Deep copy using JSON

        if(this.EventData['status'] == "Live"){
          this.isLive=true;
          this.isCompleted=false;
        }
        if(this.EventData['status']=="Completed"){
          this.isLive=false;
          this.isCompleted=true;
        } // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.error = error.message || 'An error occurred'; // Set error message
      }
    );
    console.log(this.responseData);
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

  addNewCondition() {
    this.EventAboutSec.competitionConditions.push(' Add new condition');
  }
  addforEntryRules() {
    this.EventAboutSec.forEntryRules.push('Add new Entry Rule');
  }
  addCompetitionHighlights() {
    this.EventAboutSec.competitionHighlights.push(' Add new Highlight');
  }
  updateDirectionUrl(event: any) {
    this.EventAboutSec.directionUrl = event.target.innerText.trim();
  }

  saveadout() {

    const datatemp={
      EventAboutSec: this.EventAboutSec,
      EventId:this.eventId
    }
   // console.log(JSON.stringify(data)); // This will log the JSON data to the console.
    const url = this.configService.getBaseUrl()+'/updateAbout';
    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //Call API or service to save the data
    this.http.post(url, this.EventData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.responseData = response;
        this.loading=false
        this.successMessage="Event Details Saved Succesfully";
        setTimeout(() => this.successMessage=(null), 2000);
        // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.errorMessage = 'An error occurred .Please Try again';
        setTimeout(() => this.errorMessage=(null), 2000);// Set error message
      }
    );
    // You can also send this JSON to your backend or handle it as needed.
  }

  toggleLive() {
    this.loading=true;
    this.isLive = !this.isLive;
    if(this.isLive==true){
      this.EventData['status']="Live";
      const url = this.configService.getBaseUrl()+'/Updatecompetition';
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
       this.successMessage = 'Market Live Succesfully ';
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
}

  toggleCompleted() {
    this.loading=false;
    this.isCompleted = this.isCompleted;
    if(this.isCompleted){
      this.EventData['status']="Completed";
      const url = this.configService.getBaseUrl()+'/Updatecompetition';
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
       this.successMessage = 'Market Completed Succesfully ';
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
    this.emailScoreCards();
    }
  }
  emailScoreCards() {
    const url = this.configService.getBaseUrl()+'/send-scorecard';
    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data={
      EventId:this.eventId
    }
    console.log('data',data)
    const jsonData = JSON.stringify(data);
    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (responseDta) => {
        console.log('POST request successful:', responseDta);
       //this.ScoreCard = responseDta.scorecard;this.loading=false;
       this.successMessage = 'Sent Event Schedule Email  Succesfully ';
       setTimeout(() => this.successMessage=(null), 2000);
        // Assign response to a variable to use in template
     },
     (error) => {
       console.info('Error making POST request:', error);
       this.errorMessage = 'Error Occured  ';
       setTimeout(() => this.errorMessage=(null), 2000);
     }
    );


  }
  addTextField() {
    this.EventData.eventCategory = [...this.EventData.eventCategory, '']; // Use spread operator to avoid direct mutation
  }

  // Function to remove a text field
  removeTextField(index: number) {
    this.EventData.eventCategory.splice(index, 1); // Remove the field at the specified index
  }

  // Track by index to ensure Angular properly tracks each input field
  trackByIndex(index: number, item: string) {
    return index;
  }
  saveEventData() {
    console.log(this.responseData);
    // Logic to handle saving the updated event data
    console.log('Event Data Saved:', this.EventData);
    const url = this.configService.getBaseUrl()+'/competition';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // Call API or service to save the data
    this.http.post(url, this.EventData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.responseData = response;
        this.loading=false
        this.successMessage="Event Details Saved Succesfully";
        setTimeout(() => this.successMessage=(null), 2000);
        // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.errorMessage = 'An error occurred .Please Try again';
        setTimeout(() => this.errorMessage=(null), 2000);// Set error message
      }
    );
    if (JSON.stringify(this.EventData.eventCategory) !== JSON.stringify(this.EventDataTemp.eventCategory)) {
      const url = this.configService.getBaseUrl()+'/configEventOrder';
      // Define the HTTP headers
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      // Call API or service to save the data
      this.http.post(url, this.EventData, { headers }).subscribe(
        (response) => {
          console.log('POST request successful:', response);
          this.responseData = response;
          this.loading=false
          this.successMessage="Event Details Saved Succesfully";
          setTimeout(() => this.successMessage=(null), 2000);
          // Assign response to a variable to use in template
        },
        (error) => {
          console.info('Error making POST request:', error);
          this.errorMessage = 'An error occurred .Please Try again';
          setTimeout(() => this.errorMessage=(null), 2000);// Set error message
        }
      );

    }


  }

  saveandNavifatetoScoreCard(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
    this.router.navigate(['ScoreCardConfig'], navigationExtras);
    //this.router.navigate(['addTeam']); // Replace with your desired rout
  }
  NavigateToAccessTokens():void{

    this.HostAccess=localStorage.getItem('HostAccess')
    if (this.HostAccess=="true")
    {
       const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
     // Construct the URL manually
     const url = this.router.createUrlTree(['getAccessTokens'], navigationExtras).toString();
     const baseUrl = window.location.origin; // Get the base URL of the application
     const fullUrl = `${baseUrl}${url}`;
     // Open the URL in a new tab
     window.open(fullUrl, '_blank');
  }else{
       const currentUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });

    //  this.NavigateToAccessTokens()

  }

  }

  NavigateToLeadBord():void{

    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
     // Construct the URL manually
     const url = this.router.createUrlTree(['viewLeadBord'], navigationExtras).toString();
     const baseUrl = window.location.origin; // Get the base URL of the application
     const fullUrl = `${baseUrl}${url}`;
     // Open the URL in a new tab
     window.open(fullUrl, '_blank');

  }

  NavigateEventSchedule():void{

    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
     // Construct the URL manually
     const url = this.router.createUrlTree(['eventOrderConfig'], navigationExtras).toString();
     const baseUrl = window.location.origin; // Get the base URL of the application
     const fullUrl = `${baseUrl}${url}`;
     // Open the URL in a new tab
     window.open(fullUrl, '_blank');

  }
  isOpen = false;

  openPopup() {
    this.isOpen = true;
  }

  closePopup() {
    this.isOpen = false;
    // You can add logic to handle form submission or data processing here
  }

  NavigateToScoreCard(): void {
    //this.openPopup()
    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
    this.router.navigate(['scoreCard'], navigationExtras);// Replace with your desired rout
  }

  updateTeam():void{
    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
    this.router.navigate(['addTeam'], navigationExtras);
    //this.router.navigate(['addTeam']); // Replace with your desired rout
  }

  updateJudges():void {
    const navigationExtras: NavigationExtras = {
      queryParams: { eventId:this.eventId },
      state: { someOtherData: 'value' } // Optionally pass additional data
    };
    this.router.navigate(['confJudges'], navigationExtras);
    //this.router.navigate(['addTeam']); // Replace with your desired rout
  }

}
