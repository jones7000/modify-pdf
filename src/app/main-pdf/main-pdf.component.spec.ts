import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPdfComponent } from './main-pdf.component';

describe('MainPdfComponent', () => {
  let component: MainPdfComponent;
  let fixture: ComponentFixture<MainPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
