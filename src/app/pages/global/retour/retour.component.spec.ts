import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetourComponent } from './retour.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RetourModule } from './retour.module';

describe('RetourComponent', () => {
  let component: RetourComponent;
  let fixture: ComponentFixture<RetourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RetourModule],
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
