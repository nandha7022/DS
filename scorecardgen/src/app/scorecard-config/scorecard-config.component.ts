import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-scorecard-config',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './scorecard-config.component.html',
  styleUrl: './scorecard-config.component.css',
})
export class ScorecardConfigComponent {
  isListening: boolean = false;
  eventId: any;
  TeamId:any;
  error: any;
  judgeId: any;
  TeamsInfo!: any;
  scoreCardId!:any;
  ScoreCard: { [key: string]: number | string } = {};
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  options: string[] = ['Tap', 'Hip-Hop', 'Jazz'];
  category: any;

  EventData!: any;
  ScorecardMeta: any;
  private initializeScoreCard(): void {
    // Set default score properties to 0 and include additional fields
    this.ScorecardMeta.forEach((item: { name: string | number; }) => {
      this.ScoreCard[item.name] = 0; // Initialize score fields dynamically
    });

    // Adding additional fields like total and comments
    this.ScoreCard['total'] = 0; // Total score, initially set to 0
    this.ScoreCard['comments'] = ''; // Comments field, initially empty
  }
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.judgeId = params['judgeId'];
     if (this.eventId && this.judgeId) {
       // Use the eventId here, e.g., for data fetching or processing
       console.log('Retrieved eventId:', this.eventId);
       console.log('Retrieved judgeID:', this.judgeId);
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
     const datat ={
       EventId:this.eventId
     }
     const jsonData = JSON.stringify(datat);
     // Make the POST request with the provided data
     this.http.post<any>(url, jsonData, { headers }).subscribe(
       (response) => {
         console.log('POST request successful:', response);
         this.EventData = response;
          this.options=this.EventData.eventCategory;
         console.log(this.ScorecardMeta)// this.initializeScoreCard();
       // Assign response to a variable to use in template
       },
       (error) => {
         console.info('Error making POST request:', error);
       }
     );

   const data ={
    EventId:this.eventId
   }

  const urlForteamsJudges = `https://competationhoster.azurewebsites.net/getTeamsJudges/${this.eventId}`;
  this.http.get<any>(urlForteamsJudges).subscribe(
    (data) => {
      // Assign the received data to eventMetaData
      this.TeamsInfo = data[0].teamsInfo;
      console.info('scoreCard data info',data)
      console.info('TeamsInfo ', this.TeamsInfo);
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
  }
  onChange():void {
    if(this.TeamId!=null && this.category!=null)
    {
      this.onTeamChange();
    }
  }
  onTeamChange(): void {
    const url = this.configService.getBaseUrl()+'/getScorecard';
    console.log('started Team Change get ')
    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data ={
      EventId:this.eventId,
      judgeId:this.judgeId,
      teamId:this.TeamId,
      category:this.category
    }
    console.log('data',data)
    this.loading=true;
    const jsonData = JSON.stringify(data);
    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (responseDta) => {
        console.log('POST request successful:', responseDta);
        const selectedCategory = this.EventData.scorecardMeta.find((item: any) => item.category === this.category);
        this.loading=false;

        if (selectedCategory) {
          this.ScorecardMeta = selectedCategory.parameters; // Access the parameters of the selected category
        } else {
          console.error('Selected category not found');
        }
        this.ScoreCard = responseDta[0].scorecard;
       this.ScoreCard['comments']=responseDta[0].comments;
       this.scoreCardId=responseDta[0].id//
       this.loading=false;
       this.successMessage = 'Fetched Scorecard Info Succesfully ';
        setTimeout(() => this.successMessage=(null), 2000);
         // Assign response to a variable to use in template
      },
      (error) => {
        this.loading=false;
        console.info('Error making POST request:', error);
        this.errorMessage = 'Error Occured  ';
        setTimeout(() => this.errorMessage=(null), 2000);

        this.error = error.message || 'An error occurred'; // Set error message
      }
    );

  }
  validateScore(item: any): void {
    const currentValue = this.ScoreCard[item.name];

    // Ensure the value doesn't exceed maxScore
    if (currentValue > item.maxScore) {
      this.ScoreCard[item.name] = item.maxScore;  // Set it to maxScore if exceeded
    } else { // @ts-ignore
      if (currentValue < 0) {
            this.ScoreCard[item.name] = 0;  // Ensure minimum value is 0
          }
    }
  }



  commentsObject:any;
  results: string ='';

  startListening() {
    // Check if the browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      // Create a new instance of webkitSpeechRecognition
      const vSearch = new (<any>window).webkitSpeechRecognition();
      vSearch.continuous = true; // Continuous recognition
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();

      // Event listener for when speech recognition results are available
      vSearch.onresult = (e:any) => {
        this.commentsObject=e.results;
        for (const comment of this.commentsObject) {
          const transcript = comment[0].transcript;
          console.log(comment[0].transcript);
          this.results += transcript;

        }
     // Store the recognized text
        this.getResult();
      };
      // Event listener for the stop button click
      const stopButton = document.getElementById('stopButton');
      if (stopButton) {
        stopButton.addEventListener('click', () => {
          vSearch.stop(); // Stop the speech recognition
        });
      } else {
        console.error('Stop button not found');
      }
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }

  stopListening() {
  }
  getResult() {
    // Process the recognized text
    console.log(this.results);
    this.ScoreCard['comments']=this.ScoreCard['comments']+this.results;
  }

  submitScorecard():void{
    console.log("score card {}",this.ScoreCard)

    const url = this.configService.getBaseUrl()+'/update_scores';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log('score card ',this.ScoreCard);
    const scorecard: { [key: string]: number } = {};
    let total = 0;

// Calculate individual scores and total dynamically
   this.ScorecardMeta.forEach((item: { name: string | number; }) => {
   const score = parseInt((this.ScoreCard[item.name] || 0).toString(), 10);
   scorecard[item.name] = score;
   total += score;
});

// Add the total score to the scorecard
scorecard['total'] = total;

// Construct the data object
const data = {
  EventId: this.eventId,
  id: this.scoreCardId,
  scorecard: scorecard,
  comment: this.ScoreCard['comments'] // TeamName: can be added here if needed
};

// Log the data object
console.log('data', data);

// Convert to JSON
const jsonData = JSON.stringify(data);

    this.loading=true;
    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (responseDta) => {
        console.log('POST request successful:', responseDta);
       //this.ScoreCard = responseDta.scorecard;this.loading=false;
       this.successMessage = 'Saved Scorecard Info Succesfully ';
       this.loading=false;
       setTimeout(() => this.successMessage=(null), 2000);
        // Assign response to a variable to use in template
     },
     (error) => {
       this.loading=false;
       console.info('Error making POST request:', error);
       this.errorMessage = 'Error Occured  ';
       setTimeout(() => this.errorMessage=(null), 2000);

       this.error = error.message || 'An error occurred'; // Set error message
     }
    );


  }

}
