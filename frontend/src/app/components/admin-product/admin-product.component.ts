import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { ProductService, Category } from '../../services/product.service';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string = '';
  isDragging = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category_id: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file: File): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Por favor, selecione apenas arquivos de imagem', 'Fechar', {
        duration: 3000
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('A imagem deve ter no máximo 5MB', 'Fechar', {
        duration: 3000
      });
      return;
    }

    this.selectedFile = file;
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    // Set image path in form (following existing pattern)
    const fileName = file.name;
    this.productForm.patchValue({ image: `/assets/img/${fileName}` });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = '';
    this.productForm.patchValue({ image: '' });
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      this.loading = true;
      
      const formValue = this.productForm.value;
      const productData = {
        name: formValue.name,
        description: formValue.description,
        price: parseFloat(formValue.price),
        image: `/assets/img/${this.selectedFile.name}`,
        images: [`/assets/img/${this.selectedFile.name}`],
        category_id: parseInt(formValue.category_id),
        stock: parseInt(formValue.stock) || 0
      };

      this.adminService.createProduct(productData).subscribe({
        next: (response) => {
          this.snackBar.open('Produto cadastrado com sucesso! Lembre-se de colocar a imagem em frontend/src/assets/img/', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = '';
          this.loading = false;
        },
        error: (error) => {
          const message = error.error?.message || 'Erro ao cadastrar produto';
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
