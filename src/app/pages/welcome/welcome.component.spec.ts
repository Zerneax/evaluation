import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ WelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);

    router = TestBed.get(Router);
    spyOn(router, 'navigate').and.callFake(() => {return null});

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test goToClasse', () => {
    component.goToClasse();
    expect(router.navigate).toHaveBeenCalledWith(['/classe']);
  });

  it('should test goToVisualiser', () => {
    component.goToVisualiser();
    expect(router.navigate).toHaveBeenCalledWith(['/exporter']);
  });
});
