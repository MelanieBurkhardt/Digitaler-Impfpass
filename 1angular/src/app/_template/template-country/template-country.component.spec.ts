import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCountryComponent } from './template-country.component';

describe('TemplateCountryComponent', () => {
  let component: TemplateCountryComponent;
  let fixture: ComponentFixture<TemplateCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
