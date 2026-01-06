import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Category } from './product.service';

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category_id: number;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createCategory(data: CreateCategoryRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, data, { headers: this.getHeaders() });
  }

  createProduct(data: CreateProductRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }
}

