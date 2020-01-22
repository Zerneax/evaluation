import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classe } from 'src/app/model/classe';
import { Evaluation } from 'src/app/model/evaluation';

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.scss']
})
export class VisualiserComponent implements OnInit {

  public classe: Classe = undefined;
  public evaluations: Array<Evaluation> = new Array();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  uploadFileClasse(event) {
    let reader = new FileReader();

    let [file] = event.target.files;
    reader.readAsText(file);

    reader.onload = () => {
      let json = JSON.parse(JSON.stringify(reader.result));
      this.classe = JSON.parse(json);
    }
  }

  uploadFileEvaluation(event) {
    let reader = new FileReader();

    let [file] = event.target.files;
    reader.readAsText(file);

    reader.onload = () => {
      const evaluations = reader.result.toString().split("\n");
      this.decodeEvaluations(evaluations);
    }
  }

  decodeEvaluations(evaluations: Array<string>) {
    evaluations
      .filter(evaluation => evaluation != "")
      .filter(evaluation => this.classe.eleves.findIndex(eleve => evaluation.split(";")[0] == eleve.id.toString()) != -1)
      .map(evaluation => {
          let splitEvaluation = evaluation.split(";");
          return new Evaluation(splitEvaluation[0], this.convertIdEleveToEleve(splitEvaluation[0]));
      })
      .forEach(e => {
        let index = this.evaluations.findIndex(el => el.idEleve == e.idEleve);
        if(index == -1)
          this.evaluations.push(e);
      });

    evaluations.forEach(evaluation => {
    this.evaluations.forEach(e => {
        if(e.idEleve == evaluation.split(";")[0]) {
          if(evaluation.split(";")[2] == "E") {
            e.autoEvaluation = this.decodeAutoEvaluation(evaluation.split(";")[1]);
          } else {
            e.evaluation = this.decodeEvaluation(evaluation.split(";")[1]);
          }
        }
    });

    })
  }

  addEvaluation(evaluation: Array<string>) {
    let idEleve = evaluation[0];
    let note = evaluation[1];
    let qui = evaluation[2];

    // if(qui == "E") {
    //   return new Evaluation(
    //       this.convertIdEleveToEleve(idEleve),
    //       this.decodeAutoEvaluation(note),
    //       "");
    // } else {
    //     return new Evaluation(
    //       this.convertIdEleveToEleve(idEleve),
    //       "",
    //       this.decodeEvaluation(note));
    // }

  }

  convertIdEleveToEleve(idEleve: string) {
    let eleve = this.classe.eleves.find(eleve => idEleve == eleve.id.toString());
    return eleve != undefined ? eleve.nomPrenom : "erreur";
  }

  decodeAutoEvaluation(autoEvaluation: string) {
    if(autoEvaluation == "1") {
      return "j'ai réussi";
    } else if(autoEvaluation == "2") {
      return "je ne sais pas";
    } else if(autoEvaluation == "3") {
      return "je n'ai pas réussi";
    } else {
      return "erreur";
    }
  }

  decodeEvaluation(evaluation: string) {
    if(evaluation == "1") {
      return "acquis";
    } else if(evaluation == "2") {
      return "A voir ? ";
    } else if(evaluation == "3") {
      return "non acquis";
    } else {
      return "erreur";
    }
  }
}
