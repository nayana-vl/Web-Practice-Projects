import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNav } from './global-nav';

describe('GlobalNav', () => {
  let component: GlobalNav;
  let fixture: ComponentFixture<GlobalNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalNav],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
