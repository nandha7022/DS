import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading-service.service';

describe('LoadingServiceService', () => {
  let service: LoadingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
