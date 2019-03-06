import { TestBed } from '@angular/core/testing';

import { PostUtilsService } from './post-utils.service';

describe('PostUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostUtilsService = TestBed.get(PostUtilsService);
    expect(service).toBeTruthy();
  });
});
