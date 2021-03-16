import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPageComponent } from './join-page.component';

describe('JoinPageComponent', () => {
  let component: JoinPageComponent;
  let fixture: ComponentFixture<JoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
