import { Eleve } from './eleve';

export class Classe {
  public professeur: string;
  public eleves: Array<Eleve>;


  constructor(professeur: string, eleves: Array<Eleve>) {
    this.professeur = professeur;
    this.eleves = eleves;
  }
}
