import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingService } from '../loading.service';
import { ScrollbannerComponent } from '../scrollbanner/scrollbanner.component';
import {CoreConfigService} from "../core-config.service";

// Adjust path as needed


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [FormsModule,CommonModule,ScrollbannerComponent],
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css']
})
export class HomescreenComponent implements OnInit {
  eventMetaData: any;
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private http: HttpClient,public loadingService: LoadingService ,private configService: CoreConfigService) {}

  ngOnInit(): void {
    //this.startAutoScroll();
    this.loading=true;
    this.http.get<any>(this.configService.getBaseUrl()+'allcompe').subscribe(
      (data) => {
        // Assign the received data to eventMetaData
        this.eventMetaData = data;
        // this.loadingService.hide();
        this.loading=false;
        //this.startAutoScroll();
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading=false;
      }
    );

  }

  navigateToDetails(eventId:string){
      const navigationExtras: NavigationExtras = {
        queryParams: { eventId:eventId },
        state: { someOtherData: 'value' } // Optionally pass additional data
      };
      this.router.navigate(['details'], navigationExtras);
      //this.router.navigate(['addTeam']); // Replace with your desired rout

  }

}
