import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetationDetailsComponent } from './competation-details.component';

describe('CompetationDetailsComponent', () => {
  let component: CompetationDetailsComponent;
  let fixture: ComponentFixture<CompetationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
