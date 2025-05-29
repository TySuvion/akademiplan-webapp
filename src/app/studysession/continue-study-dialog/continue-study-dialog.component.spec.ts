import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueStudyDialogComponent } from './continue-study-dialog.component';

describe('ContinueStudyDialogComponent', () => {
  let component: ContinueStudyDialogComponent;
  let fixture: ComponentFixture<ContinueStudyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinueStudyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinueStudyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
