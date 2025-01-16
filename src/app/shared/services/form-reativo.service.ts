import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormReativoService {

  constructor(
    private fb: FormBuilder
  ) { }

  /**
   * 
   * @param form Form Group que possui o control onde será setado o Validator.
   * @param formControl o control onde será setado o Validator.
   * @param validators os validators que serão setados ao control. Pode ser mais de um.
   * @returns o Form Group devidamente atualizado.
   */
  public setValidators(form: FormGroup, formControl: string, ...validators: ValidatorFn[]) {
    form.get(formControl)!.setValidators(validators);
    form.get(formControl)!.updateValueAndValidity();

    return form;
  }

  /**
   * 
   * @param form Form Group que possui o control que terá os Validators removidos (todos).
   * @param formControl os controls onde será removido os Validators (todos). Pode ser mais de um.
   * @returns o Form Group devidamente atualizado.
   */
  clearValidators(form: FormGroup, ...formControl: string[]) {
    formControl.forEach(
      control => {
        form.get(control)!.clearValidators();
        form.get(control)!.updateValueAndValidity();
      }
    );

    return form;
  }

  /**
   * 
   * @param form Form Group onde será adicionado os controls.
   * @param initialValue Valor inicial do control.
   * @param initialValidators Validators iniciais do control.
   * @param formControl os controls que serão adicionados ao Form Group. Pode ser mais de um.
   * @returns o Form Group devidamente atualizado.
   */
  addControlsToForm(form: FormGroup, initialValue?: any, initialValidators?: ValidatorFn[], ...formControl: string[]) {
    formControl.forEach(
      control => {
        form.addControl(
          control,
          this.fb.control(
            initialValue,
            initialValidators
          )
        );
      }
    )

    return form;
  };

  /**
   * 
   * @param form Form Group onde será removido os controls.
   * @param formControl os controls que serão removidos do Form Group. Pode ser mais de um.
   * @returns o Form Group devidamente atualizado.
   */
  removeControlsFromForm(form: FormGroup, ...formControl: string[]) {
    formControl.forEach(
      control => {
        form.removeControl(control);
      }
    )
    return form;
  };

  /**
   * Função utilizada para aplicar uma borda vermelha nos inputs inválidos
   * @param formGroup o formGroup que possui o controle que será modificado
   * @param control o nome do controle que será aplicado a borda
   * @returns a classe para a borda vermelha, ou uma string vazia, quando não for necessário a borda vermelha (o input estiver válido).
   */
  definindoClasseValidator(formGroup: FormGroup, control: string) {
    if (formGroup.controls[control].invalid && formGroup.controls[control].touched) {
      return 'is-invalid';
    } else {
      return '';
    }
  }
}
