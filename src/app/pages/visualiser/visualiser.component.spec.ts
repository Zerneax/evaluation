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
let mockFileReader = {
    readAsText: (blobFile) => {},
    onload: () => {},
    result : ''
}

let mockJsPDF = {
  save: (filename) => {}
}

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

    const classe: Classe = new Classe("test", [{id: 1, nomPrenom: "toto"}]);
    const file = new File([JSON.stringify(classe)], "test.json", {type: "application/json"});

    let event = { target: { files: [ file ] } };

    component.uploadFileClasse(event);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
    expect(component.classe).not.toBeUndefined();
    expect(component.classe.professeur).toEqual("test");
    expect(component.classe.eleves).toEqual([{id: 1, nomPrenom: "toto"}]);
  });

  it('should test uploadFileEvaluation', () => {
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake((blobFile) => {
      mockFileReader.result =  "1;1;E\n1;1;P";;
      mockFileReader.onload();
    });
    spyOn(component, 'decodeEvaluations').and.callFake(() => {});

    const evaluation: string = "1;1;E\n1;1;P";
    const file = new File([evaluation], "test.json", {type: "application/json"});

    let event = { target: { files: [ file ] } };

    component.uploadFileEvaluation(event);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
    expect(component.decodeEvaluations).toHaveBeenCalled();
  });

  it('should test decodeEvaluations', () => {
    const csv = [
      "1;1;E",
      "1;1;P",
      "1;1;E",
      "2;1;E",
      ""
    ];

    component.classe = new Classe("test", [{id: 1, nomPrenom: "toto"}]);
    component.decodeEvaluations(csv);

    expect(component.evaluations).not.toBeNull();
    expect(component.evaluations.length).toEqual(1);
    expect(component.evaluations[0].idEleve).toEqual("1");
    expect(component.evaluations[0].eleve).toEqual("toto");
    expect(component.evaluations[0].evaluation).toEqual(LibelleStatut.EVALUATION_OK);
    expect(component.evaluations[0].autoEvaluation).toEqual(LibelleStatut.AUTO_EVALUATION_OK);
  });

  it('should test decodeIdEleve', () => {
    component.classe = new Classe("test", [{id: 1, nomPrenom: "toto"}]);
    let retourOK = component.decodeIdEleve("1");
    expect(retourOK).toEqual("toto");

    component.classe = new Classe("test", [{id: 1, nomPrenom: "toto"}]);
    let retourInconnu = component.decodeIdEleve("2");
    expect(retourInconnu).toEqual("Elève inconnu");
  });

  it('should test decodeAutoEvaluation', () => {
    let retourOK = component.decodeAutoEvaluation("1");
    expect(retourOK).toEqual(LibelleStatut.AUTO_EVALUATION_OK);

    let retourNeSaisPas = component.decodeAutoEvaluation("2");
    expect(retourNeSaisPas).toEqual(LibelleStatut.AUTO_EVALUATION_NE_SAIS_PAS);

    let retourKO = component.decodeAutoEvaluation("3");
    expect(retourKO).toEqual(LibelleStatut.AUTO_EVALUATION_KO);

    let retourInconnu = component.decodeAutoEvaluation("4");
    expect(retourInconnu).toEqual(LibelleStatut.INCONNU);
  });

  it('should test decodeEvaluationProfesseur', () => {
    let retourOK = component.decodeEvaluationProfesseur("1");
    expect(retourOK).toEqual(LibelleStatut.EVALUATION_OK);

    let retourNeSaisPas = component.decodeEvaluationProfesseur("2");
    expect(retourNeSaisPas).toEqual(LibelleStatut.EVALUATION_NE_SAIS_PAS);

    let retourKO = component.decodeEvaluationProfesseur("3");
    expect(retourKO).toEqual(LibelleStatut.EVALUATION_KO);

    let retourInconnu = component.decodeEvaluationProfesseur("4");
    expect(retourInconnu).toEqual(LibelleStatut.INCONNU);
  });

  it('should test generateTableForPdf', () => {
    component.evaluations = [{idEleve: "1", eleve: "toto", evaluation: LibelleStatut.EVALUATION_OK, autoEvaluation: LibelleStatut.AUTO_EVALUATION_OK}];

    let table = component.generateTableForPdf();
    expect(table).not.toBeUndefined();
    expect(table.length).toEqual(1);
    expect(table[0].eleve).toEqual("toto");
    expect(table[0].autoEvaluation).toEqual(LibelleStatut.AUTO_EVALUATION_OK);
    expect(table[0].evaluation).toEqual(LibelleStatut.EVALUATION_OK);
  });

  // TODO
  // it('should test genererPdf', () => {
  //   spyOn(jsPDF, 'jsPDF').and.returnValue(mockJsPDF);
  //   spyOn(jsPDF, 'save').and.callFake((filename) => {
  //     expect(filename).toEqual(`Seance_${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.pdf`);
  //   })
  //   component.classe = new Classe("test", [{id: 1, nomPrenom: "toto"}]);
  //   component.nomSeance = "test";
  //   component.evaluations = [{idEleve: "1", eleve: "toto", evaluation: LibelleStatut.AUTO_EVALUATION_OK, autoEvaluation: LibelleStatut.EVALUATION_OK}];
  //
  //   component.genererPdf();
  //
  // });
});
