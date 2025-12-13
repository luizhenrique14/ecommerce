import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  step: number = 1;
  emailForm: FormGroup;
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  email: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  requestReset(): void {
    if (this.emailForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.requestPasswordReset(this.emailForm.value.email).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.email = this.emailForm.value.email;
          this.successMessage = 'Código enviado para seu email! Verifique sua caixa de entrada.';
          setTimeout(() => {
            this.step = 2;
            this.successMessage = '';
          }, 1500);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao solicitar reset. Verifique o email.';
        }
      });
    }
  }

  confirmReset(): void {
    if (this.resetForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { code, password } = this.resetForm.value;

      this.authService.resetPassword(this.email, code, password).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.successMessage = 'Senha alterada com sucesso! Redirecionando para login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao resetar senha. Tente novamente.';
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  backToEmail(): void {
    this.step = 1;
    this.resetForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
