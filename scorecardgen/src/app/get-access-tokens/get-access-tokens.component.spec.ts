import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAccessTokensComponent } from './get-access-tokens.component';

describe('GetAccessTokensComponent', () => {
  let component: GetAccessTokensComponent;
  let fixture: ComponentFixture<GetAccessTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAccessTokensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetAccessTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
