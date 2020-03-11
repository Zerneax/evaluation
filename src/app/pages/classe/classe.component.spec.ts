import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseComponent } from './classe.component';
import { ClasseModule } from './classe.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FileSaverService } from 'ngx-filesaver';
import { Classe } from 'src/app/model/classe';

// Mock du FileReader
const mockFileReader = {
    readAsText: (blobFile) => {},
    onload: () => {},
    result : ''
};

describe('ClasseComponent', () => {
  let component: ClasseComponent;
  let fixture: ComponentFixture<ClasseComponent>;
  let fileSaverService: FileSaverService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ClasseModule
      ],
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseComponent);

    fileSaverService = TestBed.get(FileSaverService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit', () => {
    component.ngOnInit();
    expect(component.classeForm).not.toBeUndefined();
    expect(component.classeForm.get('professeur').value).toEqual('');
    expect(component.classeForm.get('nbEleves').value).toEqual('');
    expect(component.classeForm.get('eleves').value).toEqual([]);
  });

  it('should test nbEleves value change', () => {
    spyOn(component, 'changeNbEleves').and.callFake(() => {});

    expect(component.classeForm.get('nbEleves').value).toEqual('');

    component.classeForm.get('nbEleves').patchValue(10);
    expect(component.classeForm.get('nbEleves').value).toEqual(10);
    expect(component.changeNbEleves).toHaveBeenCalled();

    component.classeForm.get('nbEleves').patchValue(-1);
    expect(component.classeForm.get('nbEleves').value).toEqual(0);

    expect(component.changeNbEleves).toHaveBeenCalledTimes(1);
  });

  it('should test changeNbEleves', () => {
    component.changeNbEleves(10);
    expect(component.classeForm.get('eleves').value.length).toEqual(10);

    component.changeNbEleves(5);
    expect(component.classeForm.get('eleves').value.length).toEqual(5);
  });

  it('should test checkIfValiderDisabled', () => {
    let retour = component.checkIfValiderDisabled();
    expect(retour).toBeTruthy();

    component.classeForm.get('professeur').patchValue('test');
    component.classeForm.get('nbEleves').patchValue(1);
    component.classeForm.get('eleves').patchValue([{nomPrenom: ''}]);

    retour = component.checkIfValiderDisabled();
    expect(retour).toBeTruthy();

    component.classeForm.get('professeur').patchValue('test');
    component.classeForm.get('nbEleves').patchValue(1);
    component.classeForm.get('eleves').patchValue([{nomPrenom: 'test'}]);

    retour = component.checkIfValiderDisabled();
    expect(retour).toBeFalsy();
  });

  it('should test valider', () => {
    spyOn(fileSaverService, 'save').and.callFake(() => {});

    component.valider();
    expect(fileSaverService.save).toHaveBeenCalled();
  });

  it('should test uploadFileClasse', () => {
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake((blobFile) => {
      mockFileReader.result =  '{"professeur":"test","eleves":[{"id":1,"nomPrenom":"toto"}]}';
      mockFileReader.onload();
    });

    const classe: Classe = new Classe('test', [{id: 1, nomPrenom: 'toto'}]);
    const file = new File([JSON.stringify(classe)], 'test.json', {type: 'application/json'});

    const event = { target: { files: [ file ] } };

    component.uploadFileClasse(event);

    expect(component.classeForm.get('professeur').value).toEqual('test');
    expect(component.classeForm.get('nbEleves').value).toEqual(1);
    expect(component.classeForm.get('eleves').value).toEqual([{id: 1, nomPrenom: 'toto'}]);
  });
});
