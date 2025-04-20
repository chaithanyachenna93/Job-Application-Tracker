import { TestBed } from '@angular/core/testing';

import { JobTableService } from './job-table.service';

describe('JobTableService', () => {
  let service: JobTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
