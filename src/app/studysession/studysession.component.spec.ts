import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudysessionComponent } from './studysession.component';

describe('StudysessionComponent', () => {
  let component: StudysessionComponent;
  let fixture: ComponentFixture<StudysessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudysessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudysessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
