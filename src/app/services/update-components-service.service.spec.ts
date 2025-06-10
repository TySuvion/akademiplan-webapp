import { TestBed } from '@angular/core/testing';

import { UpdateComponentsServiceService } from './update-components-service.service';

describe('UpdateComponentsServiceService', () => {
  let service: UpdateComponentsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateComponentsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
