import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditModalBaseComponent } from './edit-modal-base.component';

describe('EditBrandModalComponent', () => {
  let component: EditModalBaseComponent;
  let fixture: ComponentFixture<EditModalBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModalBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditModalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
