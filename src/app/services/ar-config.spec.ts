import { TestBed } from '@angular/core/testing';

import { ArConfigService } from './ar-config.service';

describe('ArConfigService', () => {
  let service: ArConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
