import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbannerComponent } from './scrollbanner.component';

describe('ScrollbannerComponent', () => {
  let component: ScrollbannerComponent;
  let fixture: ComponentFixture<ScrollbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollbannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrollbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
