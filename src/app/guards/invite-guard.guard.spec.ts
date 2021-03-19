import { TestBed } from '@angular/core/testing';

import { InviteGuardGuard } from './invite-guard.guard';

describe('InviteGuardGuard', () => {
  let guard: InviteGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InviteGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
