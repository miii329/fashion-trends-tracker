import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBaseComponent } from './card-base.component';

describe('CardBaseComponent', () => {
  let component: CardBaseComponent;
  let fixture: ComponentFixture<CardBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
