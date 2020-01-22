export class Evaluation {
  public idEleve: string;
  public eleve: string;
  public autoEvaluation: string;
  public evaluation: string;

  constructor(idEleve_: string, eleve_: string) {
    this.idEleve = idEleve_;
    this.eleve = eleve_;
    this.autoEvaluation = "";
    this.evaluation = "";
  }

  
}
