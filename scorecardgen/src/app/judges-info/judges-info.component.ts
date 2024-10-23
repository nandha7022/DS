import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-judges-info',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './judges-info.component.html',
  styleUrl: './judges-info.component.css'
})
export class JudgesInfoComponent {
  teams: any;
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}
  eventId:string=''
  testName: any;
  responseData!: any;
  error: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  judges: { id: string, name: string ,email : string,guestJugde :boolean }[] = [];

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

    const urlForteamsJudges = `https://competationhoster.azurewebsites.net/getTeamsJudges/${this.eventId}`;
    this.http.get<any>(urlForteamsJudges).subscribe(
      (data) => {
        // Assign the received data to eventMetaData
        if(data[0]['teamsInfo']!=null)
        this.teams=data[0].teamsInfo;
        if(data[0]['JudegsInfo']!=null)
        this.judges= data[0].JudegsInfo;

      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  addJudge(): void {
    this.judges.push({ id: uuidv4(), name: '' ,email : '',guestJugde :false });
  }
  toggleGuestJudge(index: number): void {
    this.judges[index].guestJugde = !this.judges[index].guestJugde;
  }
  saveandGenScoreCard():void {

    const judgesData ={
      EventId:this.eventId,
      JudegsInfo:this.judges,
      teamsInfo:this.teams
  }
  this.loading=true;
   const jsonData = JSON.stringify(judgesData);
  const url = this.configService.getBaseUrl()+'/updateJudges';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the POST request with the provided data
    this.http.post(url, jsonData, { headers }).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.loading=false;
        this.responseData = response;
        this.successMessage = 'Saved Judges Info Succesfully ';
        setTimeout(() => this.successMessage=(null), 2000);
         // Assign response to a variable to use in template
      },
      (error) => {
        this.loading=false;
        console.info('Error making POST request:', error);
        this.errorMessage = 'Saved Judges Info Succesfully ';
        setTimeout(() => this.errorMessage=(null), 2000);

        this.error = error.message || 'An error occurred'; // Set error message
      }
    );
       console.log(this.responseData);

      console.log(jsonData);
      this.router.navigate(['']); // Replace with your desired rout

  }
}
