export class Evaluation {
  public idEleve: string;
  public eleve: string;
  public autoEvaluation: string;
  public evaluation: string;

  constructor(idEleve: string, eleve: string) {
    this.idEleve = idEleve;
    this.eleve = eleve;
    this.autoEvaluation = '';
    this.evaluation = '';
  }


}
