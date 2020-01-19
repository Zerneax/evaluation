import { Eleve } from './eleve';

export class Classe {
  public professeur: string;
  public eleves: Array<Eleve>;


  constructor(professeur_: string, eleves_: Array<Eleve>) {
    this.professeur = professeur_;
    this.eleves = eleves_;
  }
}
