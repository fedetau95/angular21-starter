import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, required, min } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

interface ProductFormModel {
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  
  productModel = signal<ProductFormModel>({
    name: '',
    description: '',
    price: 0,
    category: '',
    status: 'active'
  });
  
  productForm = form(this.productModel, (f) => {
    required(f.name, { message: 'Nome obbligatorio' });
    required(f.price, { message: 'Prezzo obbligatorio' });
    min(f.price, 0.01, { message: 'Prezzo deve essere maggiore di 0' });
    required(f.category, { message: 'Categoria obbligatoria' });
  });
  
  isEditMode = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode.set(true);
      this.productService.getProduct(+id).subscribe({
        next: (product) => {
          this.productModel.set({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category,
            status: product.status
          });
        },
        error: () => {
          this.error.set('Errore nel caricamento del prodotto');
        }
      });
    }
  }
  
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.productForm().invalid()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    const id = this.route.snapshot.paramMap.get('id');
    const productData = this.productModel();
    
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
