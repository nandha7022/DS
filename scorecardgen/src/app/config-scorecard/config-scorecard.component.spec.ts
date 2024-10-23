import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigScorecardComponent } from './config-scorecard.component';

describe('ConfigScorecardComponent', () => {
  let component: ConfigScorecardComponent;
  let fixture: ComponentFixture<ConfigScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigScorecardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
