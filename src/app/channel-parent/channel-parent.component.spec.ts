import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelParentComponent } from './channel-parent.component';

describe('ChannelParentComponent', () => {
  let component: ChannelParentComponent;
  let fixture: ComponentFixture<ChannelParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
