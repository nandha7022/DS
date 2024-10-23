import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeaminfoComponent } from './add-teaminfo.component';

describe('AddTeaminfoComponent', () => {
  let component: AddTeaminfoComponent;
  let fixture: ComponentFixture<AddTeaminfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeaminfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTeaminfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
