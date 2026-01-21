import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-detail">
      @if (loading) {
        <div class="loading">Caricamento...</div>
      } @else if (product) {
        <div class="detail-header">
          <a routerLink="/products" class="back-link">← Torna alla lista</a>
          <div class="actions">
            <a [routerLink]="['/products', product.id, 'edit']" class="btn btn-primary">Modifica</a>
          </div>
        </div>
        
        <div class="detail-card">
          <h1>{{ product.name }}</h1>
          
          <div class="detail-section">
            <h3>Descrizione</h3>
            <p>{{ product.description || 'Nessuna descrizione' }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Prezzo</h3>
            <p class="price">{{ product.price | currency:'EUR' }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Categoria</h3>
            <span class="category">{{ product.category }}</span>
          </div>
          
          <div class="detail-section">
            <h3>Status</h3>
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
          
          @if (product.created_at) {
            <div class="detail-section">
              <h3>Creato il</h3>
              <p>{{ product.created_at | date:'medium' }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="error">Prodotto non trovato</div>
      }
    </div>
  `,
  styles: [`
    .product-detail {
      max-width: 800px;
    }
    
    .loading, .error {
      text-align: center;
      padding: 3rem;
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .back-link {
      color: #1976d2;
      text-decoration: none;
    }
    
    .detail-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .detail-section {
      margin: 1.5rem 0;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .detail-section:last-child {
      border-bottom: none;
    }
    
    .detail-section h3 {
      margin-top: 0;
      color: #666;
      font-size: 0.875rem;
      text-transform: uppercase;
    }
    
    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }
    
    .category {
      background: #e3f2fd;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      display: inline-block;
    }
    
    .badge {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-weight: 500;
      display: inline-block;
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
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    
    .btn-primary:hover {
      background: #1565c0;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  
  product: Product | null = null;
  loading = true;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
