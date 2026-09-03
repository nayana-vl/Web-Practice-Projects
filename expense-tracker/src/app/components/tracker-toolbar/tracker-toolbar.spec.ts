import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerToolbar } from './tracker-toolbar';

describe('TrackerToolbar', () => {
  let component: TrackerToolbar;
  let fixture: ComponentFixture<TrackerToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
