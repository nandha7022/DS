import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgesInfoComponent } from './judges-info.component';

describe('JudgesInfoComponent', () => {
  let component: JudgesInfoComponent;
  let fixture: ComponentFixture<JudgesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgesInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JudgesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
