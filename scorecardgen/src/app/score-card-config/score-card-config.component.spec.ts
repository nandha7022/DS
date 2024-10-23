import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardConfigurationComponent } from './score-card-config.component';

describe('ScorecardConfigurationComponent', () => {
  let component: ScorecardConfigurationComponent;
  let fixture: ComponentFixture<ScorecardConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorecardConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
