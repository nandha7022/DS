import { TestBed } from '@angular/core/testing';

import { CoreConfigService } from './core-config.service';

describe('CoreConfigService', () => {
  let service: CoreConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
