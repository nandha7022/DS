
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CoreConfigService} from "./core-config.service";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scorecardgen';
  HostAccess: any ;
  OwnerAccess: string | null | undefined;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private http: HttpClient,private configService: CoreConfigService) {}
 NavigateToListEvent ():void{

    this.HostAccess=localStorage.getItem('HostAccess')
    if (this.HostAccess=="true")
    {
     // Construct the URL manually
     const url = this.router.createUrlTree(['/update']).toString();
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
NavigateToHostContoller ():void{

    this.OwnerAccess=localStorage.getItem('OwnerAccess')
    if (this.OwnerAccess=="true")
    {
     // Construct the URL manually
     const url = this.router.createUrlTree(['/hostController']).toString();
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

}
