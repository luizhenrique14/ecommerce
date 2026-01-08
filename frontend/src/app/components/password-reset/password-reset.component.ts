import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-reset',
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
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  step = 1; // 1 = request, 2 = reset
  tokenExpirationTime: number = 60; // 60 minutos
  timeRemaining: string = '';
  private expirationInterval: any;
  private expirationMinutes: number = 60;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Check if email and code are in query params
    this.route.queryParams.subscribe(params => {
      if (params['email'] && params['code']) {
        this.step = 2;
        this.resetForm.patchValue({
          email: params['email'],
          code: params['code']
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onRequestReset(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.requestPasswordReset(this.requestForm.value.email).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Código de recuperação enviado para seu email!';
          this.loading = false;
          setTimeout(() => {
            this.step = 2;
            this.resetForm.patchValue({ email: this.requestForm.value.email });
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erro ao solicitar recuperação. Verifique o email.';
          this.loading = false;
        }
      });
    }
  }

  onResetPassword(): void {
    if (this.resetForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword, ...resetData } = this.resetForm.value;

      this.authService.resetPassword(
        resetData.email,
        resetData.code,
        resetData.password
      ).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Senha alterada com sucesso!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erro ao redefinir senha. Verifique o código.';
          this.loading = false;
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

