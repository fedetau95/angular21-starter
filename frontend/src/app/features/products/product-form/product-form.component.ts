import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="product-form">
      <div class="form-header">
        <h1>{{ isEditMode() ? 'Modifica Prodotto' : 'Nuovo Prodotto' }}</h1>
        <a routerLink="/products" class="back-link">← Torna alla lista</a>
      </div>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="form-card">
        <div class="form-group">
          <label for="name">Nome *</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            [class.error]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
          />
          @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
            <span class="error-message">Nome obbligatorio</span>
          }
        </div>
        
        <div class="form-group">
          <label for="description">Descrizione</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="price">Prezzo *</label>
            <input
              type="number"
              id="price"
              formControlName="price"
              step="0.01"
              min="0"
              [class.error]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
            />
            @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
              <span class="error-message">Prezzo obbligatorio e maggiore di 0</span>
            }
          </div>
          
          <div class="form-group">
            <label for="category">Categoria *</label>
            <input
              type="text"
              id="category"
              formControlName="category"
              [class.error]="productForm.get('category')?.invalid && productForm.get('category')?.touched"
            />
            @if (productForm.get('category')?.invalid && productForm.get('category')?.touched) {
              <span class="error-message">Categoria obbligatoria</span>
            }
          </div>
        </div>
        
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="active">Attivo</option>
            <option value="inactive">Inattivo</option>
            <option value="pending">In attesa</option>
          </select>
        </div>
        
        @if (error()) {
          <div class="alert alert-error">
            {{ error() }}
          </div>
        }
        
        <div class="form-actions">
          <a routerLink="/products" class="btn btn-secondary">Annulla</a>
          <button
            type="submit"
            [disabled]="productForm.invalid || loading()"
            class="btn btn-primary"
          >
            @if (loading()) {
              <span>Salvataggio...</span>
            } @else {
              <span>{{ isEditMode() ? 'Salva Modifiche' : 'Crea Prodotto' }}</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form {
      max-width: 800px;
    }
    
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .back-link {
      color: #1976d2;
      text-decoration: none;
    }
    
    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }
    
    input.error, textarea.error {
      border-color: #f44336;
    }
    
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #1565c0;
    }
    
    .btn-secondary {
      background: #757575;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #616161;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  
  productForm!: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      status: ['active']
    });
    
    if (id) {
      this.isEditMode.set(true);
      this.productService.getProduct(+id).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: () => {
          this.error.set('Errore nel caricamento del prodotto');
        }
      });
    }
  }
  
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    const id = this.route.snapshot.paramMap.get('id');
    const productData = this.productForm.value;
    
    const operation = id
      ? this.productService.updateProduct(+id, productData)
      : this.productService.createProduct(productData);
    
    operation.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Errore durante il salvataggio');
        this.loading.set(false);
      }
    });
  }
}
