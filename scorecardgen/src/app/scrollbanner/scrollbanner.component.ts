// Corrected Angular Component (TypeScript)
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router'; // Corrected import for Router
import { of } from 'rxjs';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-scrollbanner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './scrollbanner.component.html',
  styleUrls: ['./scrollbanner.component.css']
})
export class ScrollbannerComponent implements OnInit, AfterViewInit {
  @ViewChild('bannerContainer', { static: true }) bannerContainer!: ElementRef;

  items!: any[];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private configService: CoreConfigService) {}

  getBannersUrl = this.configService.getBaseUrl() + 'getBanners';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  banners: any[] | undefined;
  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    // Load banners on initialization
    this.loadBanners();
  }

  ngAfterViewInit(): void {
    // Start auto-scrolling after the component's view is initialized
    //this.startAutoScroll();
  }

  // Load existing banners
  loadBanners(): void {
    this.loading = true; // Show loading indicator
    this.http.get<any[]>(this.getBannersUrl).subscribe({
      next: (response) => {
        this.items = response; // Expecting response to be an array of banners with { BannerId, imageUrl }
        this.loading = false; // Hide loading indicator
      },
      error: (error) => {
        console.error('Error loading banners:', error);
        this.errorMessage = 'Failed to load banners';
        this.loading = false; // Hide loading indicator
      }
    });
  }

  // Starts the automatic scrolling of banner items
  startAutoScroll() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change slide every 3 seconds
  }

  // Move to the previous slide
  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  // Move to the next slide
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
   
  }

  // Go to a specific slide
  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  // Example function demonstrating an asynchronous operation
  myFunction = () => {
    console.log('Function started');
    this.startAutoScroll();
    console.log('Executed immediately after startAutoScroll');
    return 'Result';
  };
}
