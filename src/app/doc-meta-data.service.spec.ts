import { TestBed } from '@angular/core/testing';

import { DocMetaDataService } from './doc-meta-data.service';

describe('DocMetaDataService', () => {
  let service: DocMetaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocMetaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
