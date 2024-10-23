import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetationDeatilsUpdaterComponent } from './competation-deatils-updater.component';

describe('CompetationDeatilsUpdaterComponent', () => {
  let component: CompetationDeatilsUpdaterComponent;
  let fixture: ComponentFixture<CompetationDeatilsUpdaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetationDeatilsUpdaterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompetationDeatilsUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
