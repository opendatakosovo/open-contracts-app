import { TestBed, inject } from '@angular/core/testing';

import { DirectorateService } from './directorate.service';

describe('DirectorateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectorateService]
    });
  });

  it('should be created', inject([DirectorateService], (service: DirectorateService) => {
    expect(service).toBeTruthy();
  }));
});
