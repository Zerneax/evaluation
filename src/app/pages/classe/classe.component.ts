import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private fileSaverService: FileSaverService) { }

  ngOnInit() {
    this.classeForm = this.formBuilder.group({
        professeur: ['', [Validators.required, Validators.min(0)]],
        nbEleves: ['', [Validators.required]],
        eleves: [new Array<Eleve>(), Validators.required],
      });

    this.classeForm.get('nbEleves').valueChanges.subscribe(nb => {
      const newValue = parseInt(nb, 10);
      if (newValue < 0) {
        this.classeForm.get('nbEleves').patchValue(0, {emitEvent: false});
      } else {
        this.changeNbEleves(newValue);
      }
    });
  }


  changeNbEleves(nbEleves: number) {
    if (nbEleves !== undefined && nbEleves !== null) {
      const eleves: Array<Eleve> = this.classeForm.get('eleves').value;
      if (nbEleves >= eleves.length) {
        const numberOfNewEleves =  nbEleves - eleves.length;

        const lastId = eleves.length === 0 ? 1 : eleves.length + 1;

        for (let i = lastId; i < (lastId + numberOfNewEleves); i ++) {
          eleves.push(new Eleve(i, ''));
        }

        this.classeForm.get('eleves').patchValue(eleves);
      } else {
        const numberOfElevesToRemove = eleves.length - nbEleves;
        for (let i = 0; i < numberOfElevesToRemove; i++) {
          eleves.pop();
        }
        this.classeForm.get('eleves').patchValue(eleves);
      }
    }
  }

  checkIfValiderDisabled() {
    if (this.classeForm.invalid) {
      return true;
    } else {
      return this.classeForm.get('eleves').value.some(eleve => eleve.nomPrenom === '');
    }
  }

  valider() {
    const classe: Classe = new Classe(
      this.classeForm.get('professeur').value,
      this.classeForm.get('eleves').value);

    const blob = new Blob([JSON.stringify(classe)], {
     type: 'application/json'
    });

    this.fileSaverService.save(blob, classe.professeur.replace(' ', '_') + '.json');
  }

  uploadFileClasse(event: any) {
    const reader = new FileReader();

    // récupération du fichier dans un blob
    const [file] = event.target.files;
    reader.onload = () => {
      const json = JSON.parse(JSON.stringify(reader.result));
      const classe: Classe = JSON.parse(json);

      this.classeForm.get('professeur').patchValue(classe.professeur);
      this.classeForm.get('nbEleves').patchValue(classe.eleves.length);
      this.classeForm.get('eleves').patchValue(classe.eleves);
    };

    reader.readAsText(file);


  }

  buildClasseFromUploadFile(jsonClasse: string) {

  }
}
