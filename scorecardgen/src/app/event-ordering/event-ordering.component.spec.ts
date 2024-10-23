import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrderingComponent } from './event-ordering.component';

describe('EventOrderingComponent', () => {
  let component: EventOrderingComponent;
  let fixture: ComponentFixture<EventOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOrderingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
