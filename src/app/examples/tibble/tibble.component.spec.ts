import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TibbleComponent } from './tibble.component';

describe('TibbleComponent', () => {
  let component: TibbleComponent;
  let fixture: ComponentFixture<TibbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TibbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TibbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
