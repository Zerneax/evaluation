import { Component, OnInit } from '@angular/core';
import { Classe } from 'src/app/model/classe';
import { Evaluation } from 'src/app/model/evaluation';
import { LibelleStatut } from 'src/app/model/libelleStatut';

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

  constructor() { }

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
    reader.readAsText(file);

    reader.onload = () => {
      let json = JSON.parse(JSON.stringify(reader.result));
      this.classe = JSON.parse(json);
    }
  }

  uploadFileEvaluation(event) {
    let reader = new FileReader();
    // reset des evaluations
    this.evaluations = new Array();

    // récupération du fichier dans un blob
    let [file] = event.target.files;
    this.fileNameCsv = file.name;
    reader.readAsText(file);

    reader.onload = () => {
      const dataCSV = reader.result.toString().split("\n");
      this.decodeEvaluations(dataCSV);
    }
  }

  decodeEvaluations(dataCSV: Array<string>): void {
    dataCSV
      .filter(data => data != "")
      .filter(data => this.classe.eleves.findIndex(eleve => data.split(";")[0] == eleve.id.toString()) != -1)
      .map(data => {
          let splitEvaluation = data.split(";");
          return new Evaluation(splitEvaluation[0], this.decodeIdEleve(splitEvaluation[0]));
      })
      .forEach(evaluation => {
        let index = this.evaluations.findIndex(el => el.idEleve == evaluation.idEleve);
        if(index == -1)
          this.evaluations.push(evaluation);
      });

    dataCSV.forEach(data => {
      this.evaluations.forEach(e => {
        if(e.idEleve == data.split(";")[0]) {
          if(data.split(";")[2] == "E") {
            e.autoEvaluation = this.decodeAutoEvaluation(data.split(";")[1]);
          } else {
            e.evaluation = this.decodeEvaluationProfesseur(data.split(";")[1]);
          }
        }
      });
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
}
