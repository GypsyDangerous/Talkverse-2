import { TestBed } from '@angular/core/testing';

import { ChannelGuard } from './channel.guard';

describe('ChannelGuard', () => {
  let guard: ChannelGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChannelGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
