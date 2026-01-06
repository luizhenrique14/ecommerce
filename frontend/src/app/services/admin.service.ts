import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CreateCategoryRequest, CreateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:3000/api';

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

  createCategory(data: CreateCategoryRequest): Observable<unknown> {
    return this.http.post(`${this.API_URL}/categories`, data, {
      headers: this.getHeaders()
    });
  }

  createProduct(data: CreateProductRequest): Observable<unknown> {
    return this.http.post(`${this.API_URL}/products`, data, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/products/${id}`, {
      headers: this.getHeaders()
    });
  }
}

