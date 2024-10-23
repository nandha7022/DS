import { Component, NgZone, OnInit } from '@angular/core';
import { stringify } from 'querystring';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-speechtotext',
  standalone: true,
  imports: [],
  templateUrl: './speechtotext.component.html',
  styleUrl: './speechtotext.component.css'
})
export class SpeechtotextComponent  implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  text!:string;
  commentText: string = '';
  recognition!: any
  isListening: boolean = false;

  toggleSpeechRecognition(): void {
    this.isListening = !this.isListening;

    if (this.isListening) {
      if (!this.recognition) {
        this.recognition = new (<any>window).webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          this.commentText += transcript;
        };

        this.recognition.onerror = (event: ErrorEvent) => {
          console.error('Speech Recognition Error:', event.error);
          this.isListening = false; // Stop listening on error
        };
      }

      this.recognition.start(); // Start capturing audio input
    } else {
      if (this.recognition) {
        this.recognition.stop(); // Stop listening
      }
    }
  }

}
