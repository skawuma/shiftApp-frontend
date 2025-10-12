import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionDialog } from './admin-action-dialog';

describe('AdminActionDialog', () => {
  let component: AdminActionDialog;
  let fixture: ComponentFixture<AdminActionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminActionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
