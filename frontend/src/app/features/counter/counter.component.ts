import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-container">
      <h1>Esercizio 1.1: Zoneless Change Detection</h1>
      
      <div class="counter-card">
        <h2>Contatore</h2>
        
        <div class="counter-display">
          <span class="counter-value">{{ count() }}</span>
        </div>
        
        <div class="counter-info">
          <p>Valore doppio: <strong>{{ doubleCount() }}</strong></p>
          <p>È pari: <strong>{{ isEven() ? 'Sì' : 'No' }}</strong></p>
        </div>
        
        <div class="counter-actions">
          <button (click)="decrement()" class="btn btn-secondary">-</button>
          <button (click)="reset()" class="btn btn-secondary">Reset</button>
          <button (click)="increment()" class="btn btn-primary">+</button>
        </div>
        
        @if (count() > 10) {
          <div class="alert alert-info">
            ⚠️ Il contatore è maggiore di 10!
          </div>
        }
      </div>
      
      <div class="info-box">
        <h3>Note sull'esercizio:</h3>
        <ul>
          <li>✅ Zoneless change detection abilitato</li>
          <li>✅ Signals per stato reattivo</li>
          <li>✅ Computed values per valori derivati</li>
          <li>✅ Control flow &#64;if per rendering condizionale</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .counter-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      color: #1976d2;
      margin-bottom: 2rem;
    }
    
    .counter-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .counter-display {
      margin: 2rem 0;
    }
    
    .counter-value {
      font-size: 4rem;
      font-weight: bold;
      color: #1976d2;
    }
    
    .counter-info {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    
    .counter-info p {
      margin: 0.5rem 0;
    }
    
    .counter-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 80px;
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
    }
    
    .btn-secondary:hover {
      background: #616161;
    }
    
    .alert {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }
    
    .alert-info {
      background: #e3f2fd;
      color: #1976d2;
      border: 1px solid #90caf9;
    }
    
    .info-box {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .info-box h3 {
      margin-top: 0;
    }
    
    .info-box ul {
      text-align: left;
    }
  `]
})
export class CounterComponent {
  count = signal(0);
  
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  
  constructor() {
    // Effect per logging (esempio di side effect)
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
  
  increment(): void {
    this.count.update(v => v + 1);
  }
  
  decrement(): void {
    this.count.update(v => v - 1);
  }
  
  reset(): void {
    this.count.set(0);
  }
}
