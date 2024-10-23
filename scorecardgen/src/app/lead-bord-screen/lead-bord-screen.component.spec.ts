import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadBordScreenComponent } from './lead-bord-screen.component';

describe('LeadBordScreenComponent', () => {
  let component: LeadBordScreenComponent;
  let fixture: ComponentFixture<LeadBordScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadBordScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadBordScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
