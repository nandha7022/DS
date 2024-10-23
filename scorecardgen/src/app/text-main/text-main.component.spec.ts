import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMainComponent } from './text-main.component';

describe('TextMainComponent', () => {
  let component: TextMainComponent;
  let fixture: ComponentFixture<TextMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
