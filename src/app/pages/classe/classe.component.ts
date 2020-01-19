import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Eleve } from 'src/app/model/eleve';
import { Classe } from 'src/app/model/classe';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  public classeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private fileSaverService: FileSaverService) { }

  ngOnInit() {
    this.classeForm = this.formBuilder.group({
        professeur: ['', Validators.required],
        nbEleves: ['', Validators.required],
        eleves: [new Array<Eleve>(), Validators.required],
      });

    this.classeForm.get("nbEleves").valueChanges.subscribe(nb => this.changeNbEleves(nb));
  }

  changeNbEleves(nbEleves: number) {
    let eleves: Array<Eleve> = new Array<Eleve>();
    for(let i = 0; i < nbEleves; i ++) {
      eleves.push(new Eleve(i, ""));
    }

    this.classeForm.get("eleves").patchValue(eleves);
  }

  valider() {
    const classe: Classe = new Classe(this.classeForm.get("professeur").value, this.classeForm.get("eleves").value);
    console.log(classe);
    var blob = new Blob([JSON.stringify(classe)], {
     type: "application/json"
    });

    this.fileSaverService.save(blob, "test.json");
  }

}
