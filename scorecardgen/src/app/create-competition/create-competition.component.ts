import { Component, NgModule } from '@angular/core';
import saveAs from 'file-saver';
import { FormBuilder,FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, JsonPipe, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.component.html',
  imports: [CommonModule, RouterOutlet, ImageUploaderComponent],
  styleUrls: ['./create-competition.component.css'],
  standalone: true
})
export class CreateCompetitionComponent {
  competitionName: string = '';
  generalinfo!: FormGroup;
  generalinfodiv: boolean = true;
  teamdiv: boolean = false;
  judgediv: boolean = false;
  teaminfo!: FormGroup;
  judgesinfo!: FormGroup;
  selectedStep: string = 'competitionDetails';
  venueLocation: string = '';
  dateTime: string = '';
  loading!:Boolean ;
  successMessage !:any;
  errorMessage !:any;
  teams: { teamName: { id: string, name: string }, coachName: { id: string, name: string }, teamMembers: { id: string, name: string }[] }[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Initialize your form groups here
    this.generalinfo = this.formBuilder.group({
      // Define your form controls for general info
    });
    this.generalinfo.disable();
    this.teaminfo = this.formBuilder.group({
      // Define your form controls for team info
    });
    this.teaminfo.disable();
    this.judgesinfo = this.formBuilder.group({
      // Define your form controls for judges info
    });
    this.judgesinfo.disable();
  }


  // Function to show form 1
  showForm2() {
    this.generalinfodiv = false;
    this.teamdiv= true;
    this.judgediv= false;
  }
  // Function to show form 1
  showForm3() {
    this.generalinfodiv = false;
    this.teamdiv= false;
    this.judgediv= true;
  }
  // Function to show form 1
  showForm1() {
    this.generalinfodiv = true;
    this.teamdiv= false;
    this.judgediv= false;
  }
  addTeam(): void {
    this.teams.push({ teamName: { id: '', name: '' }, coachName: { id: '', name: '' }, teamMembers: [] });
  }

  addTeamMember(teamIndex: number): void {
    this.teams[teamIndex].teamMembers.push({ id: '', name: '' });
  }

  removeTeamMember(teamIndex: number, memberIndex: number): void {
    this.teams[teamIndex].teamMembers.splice(memberIndex, 1);
  }

  submitGeneralForm() {
    this.generalinfo.disable();
    this.judgesinfo.disable();
  }

  submitTeamForm() {
    this.generalinfo.disable();
    this.teaminfo.disable();
  }

  submitJudgeForm() {
    this.judgesinfo.disable();
  }

  submitForm() {
    // Create JSON object representing the form data
    const formData = {
      competitionName: this.competitionName,
      venueLocation: this.venueLocation,
      dateTime: this.dateTime
    };

    // Convert JSON object to string
    const jsonData = JSON.stringify(formData);

    // Convert string to Blob
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Save Blob as JSON file
    saveAs(blob, 'form_response.json');
  }

  isFormDisabled(formName: string): boolean {
    // Check if the form should be disabled based on the selectedStep
    if (this.selectedStep === 'competitionDetails' && formName === 'generalinfo') {
      return false; // Enable the form
    } else if (this.selectedStep === 'addTeamDetails' && formName === 'teaminfo') {
      return false; // Enable the form
    } else if (this.selectedStep === 'addJudges' && formName === 'judgesinfo') {
      return false; // Enable the form
    } else {
      return true; // Disable the form for other steps
    }
  }
}
