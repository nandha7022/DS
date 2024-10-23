import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';

import { ImageCropperModule } from 'ngx-image-cropper';
import { AddTeaminfoComponent } from '../add-teaminfo/add-teaminfo.component';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@angular/core';
import { response } from 'express';

import {CoreConfigService} from "../core-config.service";

@Component({
  selector: 'app-host-controller',
  standalone: true,
  imports: [FormsModule, CommonModule,ImageUploaderComponent,ImageCropperModule],
  templateUrl: './host-controller.component.html',
  styleUrl: './host-controller.component.css'
})
export class HostControllerComponent implements OnInit {
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  hostRequests: any[] = [];
  fetchUrl = this.configService.getBaseUrl()+'/approveHostAccess';
  createAccessUrl = this.configService.getBaseUrl()+'/CreateHostAccess';
  imageUrl!: string | ArrayBuffer | null;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  eventId:string='';
  eventImageUrl: string ='';
  responseData!: any;
  error: any;
  imageInfos?: Observable<any>;

  removeBannerUrl=this.configService.getBaseUrl()+'removeBanner';
  getBannersUrl=this.configService.getBaseUrl()+'getBanners';
   banners!: any[];

  constructor(private uploadService: FileUploadService,private router: Router,private http: HttpClient,private configService: CoreConfigService) {
    this.eventId = uuidv4();
    console.log(this.eventId);

  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchHostRequests();

    this.imageInfos = this.uploadService.getFiles();
    this.loadBanners();
  }
  loadBanners(): void {
    // Replace with your API endpoint to fetch banner images
    this.http.get<any[]>(this.getBannersUrl).subscribe({
      next: (response) => {
        this.banners = response; // Expecting response to be an array of banners with { BannerId, imageUrl }
      },
      error: (error) => {
        console.error('Error loading banners:', error);
        this.errorMessage = 'Failed to load banners';
      }
    });
  }

  previewStatus: boolean = false;
  imageUploder: boolean = true;

  showPreview() {
    this.previewStatus = true;
    this.imageUploder= false;
  }
  removeBanner(bannerId: any): void {
    this.http.post(this.removeBannerUrl, { BannerId: bannerId }).subscribe({
      next: () => {
        this.successMessage = 'Banner removed successfully';
        this.banners = this.banners.filter(banner => banner.BannerId !== bannerId); // Remove the banner from the list
      },
      error: (error) => {
        console.error('Error removing banner:', error);
        this.errorMessage = 'Failed to remove banner';
      }
    });
  }
  showUploader() {
    this.previewStatus = false;
    this.imageUploder= true;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    this.showPreview()
    this.currentFile = event.target.files[0];
    this.uploadFileLatest(file,this.eventId)
  }


  uploadFileLatest(file: File, eventId: string) {


    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('EventId', this.eventId);
    formData.append('EventType', "Banner");

    this.http.post(this.configService.getBaseUrl()+'upload', formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    }).subscribe(
      (event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            }
            break;
          case HttpEventType.Response:
            this.progress = 100; // Set progress to 100%
            if (event instanceof HttpResponse) {
              console.log('Response:', event.body);
              const response=event.body
              this.eventImageUrl=response.ImageUrl;
              this.message = 'File uploaded successfully';
            }
            break;
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.message = 'Failed to upload file.';
      }
    );
  }

  imageCropped(event: any): void {
    // Handle the cropped image data here
    console.log('Cropped Image Data:', event.base64);
    // You can save the cropped image data or perform other actions
  }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;
        const reader = new FileReader();
          this.previewStatus = true;
          this.imageUploder= false;
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }

  }
  upload(file: File | undefined): void {
    this.progress = 0;

    if (file) {
      this.currentFile = file;

      this.uploadService.upload(this.currentFile).subscribe( (response) => {
        console.log('POST request successful:', response);
        this.responseData = response; // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.error = error.message || 'An error occurred'; // Set error message
      }
    );
    } else {
      console.error('No file selected');
    }
  }
  uploadFile(file: File) {
    this.progress = 0;
    this.uploadService.upload(file).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.responseData = response; // Assign response to a variable to use in template
      },
      (error) => {
        console.info('Error making POST request:', error);
        this.error = error.message || 'An error occurred'; // Set error message
      }
    );
  }
  // Fetch host requests from the server
  fetchHostRequests() {
    this.http.post<any[]>(this.fetchUrl, {}).subscribe(
      (response) => {
        this.hostRequests = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching host requests:', error);
      }
    );
  }

  // Approve a host request
  approveRequest(request: any) {
    const requestBody = {
      Email: request.Email,
    };
    this.loading = true;
    this.http.post(this.createAccessUrl, requestBody).subscribe(
      () => {
        this.loading = false;
        alert(`Host access approved for ${request.Email}`);
        this.hostRequests = this.hostRequests.filter(
          (r) => r.Email !== request.Email
        );
      },
      (error) => {
        this.loading = false;
        console.error('Error approving host access:', error);
        alert('Error approving host access. Please try again.');
      }
    );
  }

  // Reject a host request (can be enhanced as needed)
  rejectRequest(request: any) {
    alert(`Host request rejected for ${request.Email}`);
    this.hostRequests = this.hostRequests.filter(
      (r) => r.Email !== request.Email
    );
  }

}
