import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetourComponent } from './retour.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RetourModule } from './retour.module';
import { Router } from '@angular/router';

describe('RetourComponent', () => {
  let component: RetourComponent;
  let fixture: ComponentFixture<RetourComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RetourModule],
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetourComponent);

    router = TestBed.get(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test goToHome', () => {
    spyOn(router, 'navigate').and.callFake(() => {return null});

    component.goToHome();
    expect(router.navigate).toHaveBeenCalledWith(['']);

  });
});
