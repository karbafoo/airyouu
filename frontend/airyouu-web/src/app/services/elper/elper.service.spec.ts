import { TestBed } from '@angular/core/testing';

import { ElperService } from './elper.service';

describe('ElperService', () => {
  let service: ElperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
