import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardConfigComponent } from './scorecard-config.component';

describe('ScorecardConfigComponent', () => {
  let component: ScorecardConfigComponent;
  let fixture: ComponentFixture<ScorecardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScorecardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
