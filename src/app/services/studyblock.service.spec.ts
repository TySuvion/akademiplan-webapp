import { TestBed } from '@angular/core/testing';

import { StudyblockService } from './studyblock.service';

describe('StudyblockService', () => {
  let service: StudyblockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyblockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
