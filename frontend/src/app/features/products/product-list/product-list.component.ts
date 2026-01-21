import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
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
