import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportConfirmDialogComponent } from './export-confirm-dialog-component';

describe('ExportConfirmDialogComponent', () => {
  let component: ExportConfirmDialogComponent;
  let fixture: ComponentFixture<ExportConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
