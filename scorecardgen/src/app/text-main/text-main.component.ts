import { Component } from '@angular/core';
import { AnySrvRecord } from 'dns';

@Component({
  selector: 'app-text-main',
  standalone: true,
  imports: [],
  templateUrl: './text-main.component.html',
  styleUrl: './text-main.component.css'
})
export class TextMainComponent {
  name = 'Angular';
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
        console.log(e.results[0][0].transcript);
        this.results = e.results[0][0].transcript; // Store the recognized text
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
  }
  

}
