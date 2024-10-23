import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = true;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  accessToken: string = '';
  returnUrl: any;
  isCreateAccount = false;
  createPassword: string = '';
  emailOtp: string = '';
  sentOtp: string = '';
  userName: any;
  isAuthenticated:any;
  profileData: any;
  validation:any;
  isHostRequestEnabled: boolean = false; // Tracks the checkbox state
  hostRequest: string = 'false';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient, // Inject HttpClient
    private authGuard: AuthGuard ,private configService: CoreConfigService
  ) {}

  ngOnInit() {
    console.log(localStorage.getItem('UserProfile'));
    this.profileData=localStorage.getItem('UserProfile')
    this.validation=localStorage.getItem('validation')
    // Get the return URL from the query parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);

    if (this.validation=="true") {
      this.isAuthenticated=true;
      const userProfile = localStorage.getItem('UserName') || '{}';
      this.userName = userProfile || 'User';

    }
  }
  logout() {
    localStorage.clear();
    this.authGuard.logout(); // You might need to implement a logout method in AuthGuard
    this.router.navigate(['/']); // Navigate to the home or login page
  }
  closeModal() {
    this.isModalOpen = false;
    this.router.navigate(['/']);
  }

  login() {
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe(
      success => {
        this.loading = false;
        if (success) {
          this.successMessage = 'Login successful!';
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }
  toggleHostRequest(event: Event) {
    this.hostRequest = this.isHostRequestEnabled ? 'true' : 'false';
    console.log(`Host Request is now: ${this.hostRequest}`);
  }
  loginWithToken() {
    console.log('Access Token:', this.accessToken);
    // Implement token-based access logic here
  }

  toggleCreateAccount() {
    this.isCreateAccount = !this.isCreateAccount;
  }

  generateCode(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  sendOtp() {
    this.loading = true;
    const apiUrl = this.configService.getBaseUrl()+'/SentOtp';

    const data = {
      Email: this.email
    };
    const jsonData = JSON.stringify(data);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(apiUrl, jsonData, { headers }).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = 'OTP Sent';
        console.log('POST request successful:', response);
      },
      (error: { message: string }) => {
        this.loading = false;
        this.errorMessage = 'Error sending OTP. Please try again.';
      }
    );
  }

  validateAndCreateAccount() {
    const requestBody = {
      Email: this.email,
      OTP_CODE: this.emailOtp,
    };
    const validationUrl = this.configService.getBaseUrl()+'/OtpVerification';
    this.loading=true;

    this.http.post<any>(validationUrl, requestBody).subscribe(
      (response) => {

        if (response?.validation === 'false') {
          this.errorMessage = 'Invalid OTP. Please try again.';
          return;
        }
      });
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    // Create account
    const apiUrl = this.configService.getBaseUrl()+'/createLoginDetails';
    const data = {
      Email: this.email,
      Password: this.password,
      HostAccessRequest:this.hostRequest
    };
    const jsonData = JSON.stringify(data);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(apiUrl, jsonData, { headers }).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = 'Successfully Created Account';
        console.log('POST request successful:', response);
      },
      (error: { message: string }) => {
        this.loading = false;
        this.errorMessage = 'Error creating account. Please try again.';
        console.error('Error making POST request:', error);
      }
    );
  }
}

