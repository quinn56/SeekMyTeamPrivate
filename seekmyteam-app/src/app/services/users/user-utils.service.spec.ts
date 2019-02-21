import { TestBed } from '@angular/core/testing';

import { UserUtilsService } from './user-utils.service';

describe('UserUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserUtilsService = TestBed.get(UserUtilsService);
    expect(service).toBeTruthy();
  });
});
