import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserComponent } from './visualiser.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RetourModule } from '../global/retour/retour.module';
import { Classe } from 'src/app/model/classe';
import { LibelleStatut } from 'src/app/model/libelleStatut';
import * as jsPDF from 'jspdf';

// Mock du FileReader
const mockFileReader = {
    readAsText: (blobFile) => {},
    onload: () => {},
    result : ''
};

const mockJsPDF = {
  save: (filename) => {}
};

describe('VisualiserComponent', () => {
  let component: VisualiserComponent;
  let fixture: ComponentFixture<VisualiserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        RetourModule
      ],
      declarations: [ VisualiserComponent ],
      providers: [
        DatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
    expect(component.classe).not.toBeUndefined();
    expect(component.classe.professeur).toEqual('test');
    expect(component.classe.eleves).toEqual([{id: 1, nomPrenom: 'toto'}]);
  });

  it('should test uploadFileEvaluation', () => {
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake((blobFile) => {
      mockFileReader.result =  '1;1;E\n1;1;P';
      mockFileReader.onload();
    });
    spyOn(component, 'decodeEvaluations').and.callFake(() => {});

    const evaluation = '1;1;E\n1;1;P';
    const file = new File([evaluation], 'test.json', {type: 'application/json'});

    const event = { target: { files: [ file ] } };

    component.uploadFileEvaluation(event);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
    expect(component.decodeEvaluations).toHaveBeenCalled();
  });

  it('should test decodeEvaluations', () => {
    const csv = [
      '1;1;E',
      '1;1;P',
      '1;1;E',
      '2;1;E',
      ''
    ];

    component.classe = new Classe('test', [{id: 1, nomPrenom: 'toto'}]);
    component.decodeEvaluations(csv);

    expect(component.evaluations).not.toBeNull();
    expect(component.evaluations.length).toEqual(1);
    expect(component.evaluations[0].idEleve).toEqual('1');
    expect(component.evaluations[0].eleve).toEqual('toto');
    expect(component.evaluations[0].evaluation).toEqual(LibelleStatut.EVALUATION_OK);
    expect(component.evaluations[0].autoEvaluation).toEqual(LibelleStatut.AUTO_EVALUATION_OK);
  });

  it('should test decodeIdEleve', () => {
    component.classe = new Classe('test', [{id: 1, nomPrenom: 'toto'}]);
    const retourOK = component.decodeIdEleve('1');
    expect(retourOK).toEqual('toto');

    component.classe = new Classe('test', [{id: 1, nomPrenom: 'toto'}]);
    const retourInconnu = component.decodeIdEleve('2');
    expect(retourInconnu).toEqual('Elève inconnu');
  });

  it('should test decodeAutoEvaluation', () => {
    const retourOK = component.decodeAutoEvaluation('1');
    expect(retourOK).toEqual(LibelleStatut.AUTO_EVALUATION_OK);

    const retourNeSaisPas = component.decodeAutoEvaluation('2');
    expect(retourNeSaisPas).toEqual(LibelleStatut.AUTO_EVALUATION_NE_SAIS_PAS);

    const retourKO = component.decodeAutoEvaluation('3');
    expect(retourKO).toEqual(LibelleStatut.AUTO_EVALUATION_KO);

    const retourInconnu = component.decodeAutoEvaluation('4');
    expect(retourInconnu).toEqual(LibelleStatut.INCONNU);
  });

  it('should test decodeEvaluationProfesseur', () => {
    const retourOK = component.decodeEvaluationProfesseur('1');
    expect(retourOK).toEqual(LibelleStatut.EVALUATION_OK);

    const retourNeSaisPas = component.decodeEvaluationProfesseur('2');
    expect(retourNeSaisPas).toEqual(LibelleStatut.EVALUATION_NE_SAIS_PAS);

    const retourKO = component.decodeEvaluationProfesseur('3');
    expect(retourKO).toEqual(LibelleStatut.EVALUATION_KO);

    const retourInconnu = component.decodeEvaluationProfesseur('4');
    expect(retourInconnu).toEqual(LibelleStatut.INCONNU);
  });

  it('should test generateTableForPdf', () => {
    component.evaluations = [
      {
        idEleve: '1',
        eleve: 'toto',
        evaluation: LibelleStatut.EVALUATION_OK,
        autoEvaluation: LibelleStatut.AUTO_EVALUATION_OK
      }
    ];

    const table = component.generateTableForPdf();
    expect(table).not.toBeUndefined();
    expect(table.length).toEqual(1);
    expect(table[0].eleve).toEqual('toto');
    expect(table[0].autoEvaluation).toEqual(LibelleStatut.AUTO_EVALUATION_OK);
    expect(table[0].evaluation).toEqual(LibelleStatut.EVALUATION_OK);
  });

});
