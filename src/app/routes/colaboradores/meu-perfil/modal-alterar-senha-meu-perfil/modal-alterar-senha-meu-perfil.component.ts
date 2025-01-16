import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountAccessV1Model } from 'src/app/_core/models/account-access-v1.model';
import { FormReativoService } from 'src/app/shared/services/form-reativo.service';

@Component({
  selector: 'app-modal-alterar-senha-meu-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-alterar-senha-meu-perfil.component.html',
  styles: ``
})
export class ModalAlterarSenhaMeuPerfilComponent {
  // variáveis a serem preenchidas na chamada do modal
  meuUsuario: AccountAccessV1Model;

  // variáveis de ambiente
  formAlterarSenha: FormGroup;

  constructor(
    private modalAtivo: NgbActiveModal,
    private formBuilder: FormBuilder,
    public formReativo: FormReativoService
  ) {
    this.formAlterarSenha = this.formBuilder.group(
      this.montarForm(),
      { validator: this.MustMatch('novaSenha', 'confirmarSenha') }
    );
  }

  montarForm() {
    return {
      novaSenha: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        ])
      ],
      confirmarSenha: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ]
    }
  }

  fecharModal() {
    this.modalAtivo.close(
      'Alteração de senha cancelada'
    );
  }

  /**
   * Fecha o modal de alteração de senha e retorna
   * a nova senha digitada para o componente pai.
   * @returns {string} A nova senha digitada.
   */
  emitirSenhaASerAlterada(): string {
    const novaSenha = this.formAlterarSenha.controls['novaSenha'].value;
    this.modalAtivo.close(
      novaSenha
    );
    return novaSenha;
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}