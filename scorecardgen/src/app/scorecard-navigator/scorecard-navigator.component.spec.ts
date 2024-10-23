import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardNavigatorComponent } from './scorecard-navigator.component';

describe('ScorecardNavigatorComponent', () => {
  let component: ScorecardNavigatorComponent;
  let fixture: ComponentFixture<ScorecardNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardNavigatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScorecardNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
