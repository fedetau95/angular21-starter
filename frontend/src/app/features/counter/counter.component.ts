import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
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
