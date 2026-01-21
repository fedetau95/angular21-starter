import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-list">
      <div class="header-actions">
        <h1>Prodotti</h1>
        <a routerLink="/products/new" class="btn btn-primary">Nuovo Prodotto</a>
      </div>
      
      <div class="filters">
        <select (change)="onCategoryChange($event)" class="filter-select">
          <option value="">Tutte le categorie</option>
          @for (category of categories(); track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
        
        <select (change)="onStatusChange($event)" class="filter-select">
          <option value="">Tutti gli status</option>
          <option value="active">Attivo</option>
          <option value="inactive">Inattivo</option>
          <option value="pending">In attesa</option>
        </select>
      </div>
      
      @if (productService.loading$()) {
        <div class="loading">Caricamento...</div>
      } @else if (filteredProducts().length === 0) {
        <div class="empty-state">
          <p>Nessun prodotto trovato</p>
          <a routerLink="/products/new" class="btn btn-primary">Crea il primo prodotto</a>
        </div>
      } @else {
        <div class="products-grid">
          @for (product of filteredProducts(); track product.id) {
            <div class="product-card">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description || 'Nessuna descrizione' }}</p>
              <p class="price">{{ product.price | currency:'EUR' }}</p>
              <div class="product-meta">
                <span class="category">{{ product.category }}</span>
                @switch (product.status) {
                  @case ('active') {
                    <span class="badge badge-success">Attivo</span>
                  }
                  @case ('inactive') {
                    <span class="badge badge-danger">Inattivo</span>
                  }
                  @case ('pending') {
                    <span class="badge badge-warning">In attesa</span>
                  }
                }
              </div>
              <div class="product-actions">
                <a [routerLink]="['/products', product.id]" class="btn btn-secondary">Dettagli</a>
                <a [routerLink]="['/products', product.id, 'edit']" class="btn btn-secondary">Modifica</a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .product-list {
      max-width: 1200px;
    }
    
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .product-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .product-card h3 {
      margin-top: 0;
    }
    
    .description {
      color: #666;
      margin: 0.5rem 0;
    }
    
    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
      margin: 1rem 0;
    }
    
    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
    }
    
    .category {
      background: #e3f2fd;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .badge-success {
      background: #c8e6c9;
      color: #2e7d32;
    }
    
    .badge-danger {
      background: #ffcdd2;
      color: #c62828;
    }
    
    .badge-warning {
      background: #fff9c4;
      color: #f57f17;
    }
    
    .product-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    
    .btn-primary:hover {
      background: #1565c0;
    }
    
    .btn-secondary {
      background: #757575;
      color: white;
      flex: 1;
    }
    
    .btn-secondary:hover {
      background: #616161;
    }
  `]
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  
  selectedCategory = signal<string>('');
  selectedStatus = signal<string>('');
  categories = signal<string[]>([]);
  
  filteredProducts = computed(() => {
    const products = this.productService.products$();
    const category = this.selectedCategory();
    const status = this.selectedStatus();
    
    return products.filter(p => {
      const matchCategory = !category || p.category === category;
      const matchStatus = !status || p.status === status;
      return matchCategory && matchStatus;
    });
  });
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe();
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }
  
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
    this.productService.getProducts(target.value || undefined, this.selectedStatus() || undefined).subscribe();
  }
  
  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
    this.productService.getProducts(this.selectedCategory() || undefined, target.value || undefined).subscribe();
  }
}
