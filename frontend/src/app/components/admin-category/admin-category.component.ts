import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss'
})
export class AdminCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      icon: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Auto-generate slug from name
    this.categoryForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.categoryForm.get('slug')?.dirty) {
        const slug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        this.categoryForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      this.adminService.createCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Categoria cadastrada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.categoryForm.reset();
          this.loading = false;
        },
        error: (error) => {
          const message = error.error?.message || 'Erro ao cadastrar categoria';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

