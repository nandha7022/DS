import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {CoreConfigService} from "../core-config.service";


@Component({
  selector: 'app-event-ordering',
  standalone: true,
  imports: [FormsModule, CommonModule,MatCardModule,  DragDropModule],
  templateUrl: './event-ordering.component.html',
  styleUrl: './event-ordering.component.css'
})
export class EventOrderingComponent implements OnInit {
  eventOrder: any;
  eventId:any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  profileData: any;
  HostAccess:any;
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}

  ngOnInit(): void {
    this.loading=true;
    this.profileData=localStorage.getItem('UserProfile')
    // this.validation=true
    if (localStorage.getItem('HostAccess')=="true")
    {
      this.HostAccess=true;
    }
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
  const url = this.configService.getBaseUrl()+'/getEventOrder';

    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (response) => {
        this.loading=false;

        console.log('POST request successful:', response);
        this.eventOrder = response;
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.errorMessage = 'An error occurred .Please Try again';
        setTimeout(() => this.errorMessage=(null), 2000);// Set error message
      }
    );

     } else {
       // Handle the case where 'eventId' is not present
       console.error('eventId parameter not found in query string.');
     }
   });

  }

  drop(event: CdkDragDrop<string[]>, category: { performances: any[]; }): void {
    moveItemInArray(category.performances, event.previousIndex, event.currentIndex);
    this.updatePerformanceOrder(category);
  }

  updatePerformanceOrder(category: { performances: any[]; }): void {
    category.performances.forEach((performance: { order: any; }, index: number) => {
      performance.order = index + 1;
    });
  }
  deletePerformance(category: any, performance: any) {
    const index = category.performances.indexOf(performance);
    if (index > -1) {
      category.performances.splice(index, 1);
    }

    // Update the order property of each remaining performance
    category.performances.forEach((perf: { order: any; }, idx: number) => {
      perf.order = idx + 1;
    });
  }
saveOrder() {
  console.log(JSON.stringify(this.eventOrder, null, 2));

    const url = this.configService.getBaseUrl()+'/updateEventOrder';
    // Define the HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data=this.eventOrder;
    console.log('data',data)
    const jsonData = JSON.stringify(data);
    this.loading=true;
    // Make the POST request with the provided data
    this.http.post<any>(url, jsonData, { headers }).subscribe(
      (responseDta) => {
        console.log('POST request successful:', responseDta);
       //this.ScoreCard = responseDta.scorecard;this.loading=false;
       this.successMessage = 'Saved Event Schedule Info Succesfully ';
       this.loading=false;
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

  emailEventSchedule() {

      const url = this.configService.getBaseUrl()+'/sendEventSchedule';
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
}
