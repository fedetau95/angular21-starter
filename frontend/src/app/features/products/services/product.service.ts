import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/api/products';
  
  private products = signal<Product[]>([]);
  private loading = signal(false);
  
  readonly products$ = this.products.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  
  getProducts(category?: string, status?: string): Observable<Product[]> {
    this.loading.set(true);
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (category) params.push(`category=${category}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += '?' + params.join('&');
    
    return this.http.get<Product[]>(url).pipe(
      tap({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }
  
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  
  createProduct(product: Omit<Product, 'id' | 'user_id' | 'created_at'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(newProduct => {
        this.products.update(ps => [...ps, newProduct]);
      })
    );
  }
  
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updatedProduct => {
        this.products.update(ps =>
          ps.map(p => p.id === id ? updatedProduct : p)
        );
      })
    );
  }
  
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.products.update(ps => ps.filter(p => p.id !== id));
      })
    );
  }
  
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('/api/categories');
  }
}
