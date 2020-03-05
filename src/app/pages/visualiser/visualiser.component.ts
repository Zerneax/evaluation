import { Component, OnInit } from '@angular/core';
import { Classe } from 'src/app/model/classe';
import { Evaluation } from 'src/app/model/evaluation';
import { LibelleStatut } from 'src/app/model/libelleStatut';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.scss']
})
export class VisualiserComponent implements OnInit {

  public classe: Classe = undefined;
  public evaluations: Array<Evaluation> = new Array();
  public fileNameClasse: string = "";
  public fileNameCsv: string = "";
  public nomSeance: string = "";

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
  }

  uploadFileClasse(event: any) {
    let reader = new FileReader();
    // reset de la classe et du tableau d'évaluation
    this.classe = undefined;
    this.evaluations = new Array();

    // récupération du fichier dans un blob
    let [file] = event.target.files;
    this.fileNameClasse = file.name;

    reader.onload = () => {
      let json = JSON.parse(JSON.stringify(reader.result));
      this.classe = JSON.parse(json);
    }

    reader.readAsText(file);
  }

  uploadFileEvaluation(event) {
    let reader = new FileReader();
    // reset des evaluations
    this.evaluations = new Array();

    // récupération du fichier dans un blob
    let [file] = event.target.files;
    this.fileNameCsv = file.name;

    reader.onload = () => {
      const dataCSV = reader.result.toString().split("\n");
      this.decodeEvaluations(dataCSV);
    }

    reader.readAsText(file);
  }

  // fonction permettant de décoder le fichier CSV contenant l'évaluation
  // Format du CSV : idEleve;Evaluation;Qui
  // valeur possible pour Evaluation : 1, 2, 3 (voir decodeEvaluation plus bas)
  // valeur possible pour Qui : E (Eleve), P (Professeur)
  decodeEvaluations(dataCSV: Array<string>): void {
    dataCSV
      .filter(data => data != "") // filtre les lignes vides
      // on filtre pour ne garder que les eleves connus
      .filter(data => this.classe.eleves.findIndex(eleve => data.split(";")[0] == eleve.id.toString()) != -1)
      // création d'une liste d'évaluation
      .map(data => {
          let splitEvaluation = data.split(";");
          // pour le moment, on fait juste le listing des éléves
          return new Evaluation(
            splitEvaluation[0],
            this.decodeIdEleve(splitEvaluation[0]));
      })
      // supression des doublons
      .forEach(evaluation => {
        let index = this.evaluations.findIndex(el => el.idEleve == evaluation.idEleve);
        if(index == -1) // si index == -1 alors il n'y a pas doublon
          this.evaluations.push(evaluation);
      });

    // on reparcours le CSV pour maintenant récupérer l'évalution en elle même
    dataCSV.forEach(data => {
      let evaluation = this.evaluations.find(evaluation => evaluation.idEleve == data.split(";")[0]);

      if(evaluation != undefined) {
        if(data.split(";")[2] == "E") evaluation.autoEvaluation = this.decodeAutoEvaluation(data.split(";")[1]);
        else evaluation.evaluation = this.decodeEvaluationProfesseur(data.split(";")[1]);
      }
    })
  }

  decodeIdEleve(idEleve: string): string {
    let eleve = this.classe.eleves.find(eleve => idEleve == eleve.id.toString());
    return eleve != undefined ? eleve.nomPrenom : "Elève inconnu";
  }

  decodeAutoEvaluation(autoEvaluation: string): string {
    switch (autoEvaluation) {
      case "1": {
        return LibelleStatut.AUTO_EVALUATION_OK;
      }
      case "2": {
        return LibelleStatut.AUTO_EVALUATION_NE_SAIS_PAS;
      }
      case "3": {
        return LibelleStatut.AUTO_EVALUATION_KO;
      }
      default: {
        return LibelleStatut.INCONNU;
      }
    }
  }

  decodeEvaluationProfesseur(evaluationProfesseur: string): string {
    switch (evaluationProfesseur) {
      case "1": {
        return LibelleStatut.EVALUATION_OK;
      }
      case "2": {
        return LibelleStatut.EVALUATION_NE_SAIS_PAS;
      }
      case "3": {
        return LibelleStatut.EVALUATION_KO;
      }
      default: {
        return LibelleStatut.INCONNU;
      }
    }
  }

  genererPdf() {
    var doc = new jsPDF();

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(145, 5, `Généré le : ${new Date().toLocaleString()}` );

    doc.setFontSize(30);
    doc.setTextColor(38, 84, 124);
    doc.text(85, 30, "Evaluation");

    doc.setTextColor('black');
    doc.setFontSize(16);
    doc.text(60, 45, `Classe de: ${this.classe.professeur}` );

    doc.setFontSize(16);
    doc.text(60, 55, `Objectif de la séance: ${this.nomSeance}` );

    let headers = [
      {
        'id': "eleve",
        'name': "eleve",
        'prompt':"Elève",
        'width': 60
      },
      {
        'id': "autoEvaluation",
        'name': "autoEvaluation",
        'prompt':"Auto evaluation",
        'width': 60
      },
      {
        'id': "evaluation",
        'name': "evaluation",
        'prompt':"Evaluation",
        'width': 60
      }
    ];

    doc.table(40, 70, this.generateTableForPdf(), headers, {fontSize: 12});
    doc.save(`Seance_${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.pdf`);
  }

  generateTableForPdf() {
    let table = this.evaluations.map(evaluation => {
      return {
        eleve : evaluation.eleve,
        autoEvaluation: evaluation.autoEvaluation,
        evaluation: evaluation.evaluation
      };
    });

    return table;
  }
}
