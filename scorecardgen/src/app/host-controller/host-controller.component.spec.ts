import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostControllerComponent } from './host-controller.component';

describe('HostControllerComponent', () => {
  let component: HostControllerComponent;
  let fixture: ComponentFixture<HostControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
