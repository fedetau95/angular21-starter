# 📝 Esercizi Progressivi - Angular 21

Questo documento contiene esercizi dettagliati per imparare Angular 21 passo dopo passo.

---

## 🎯 Livello 1: Fondamenta

### Esercizio 1.1: Setup Zoneless Change Detection

**Obiettivo**: Configurare un progetto Angular 21 con Zoneless change detection e creare un contatore interattivo.

**Passi**:

1. **Verifica configurazione Zoneless**
   - Apri `src/main.ts`
   - Verifica che `provideExperimentalZonelessChangeDetection()` sia presente

2. **Crea componente Counter**
   ```bash
   ng generate component features/counter --standalone
   ```

3. **Implementa logica con Signals**
   - Usa `signal()` per il contatore
   - Usa `computed()` per valori derivati
   - Usa `effect()` per side effects

4. **Template con Control Flow**
   - Usa `@if` per mostrare messaggi condizionali
   - Aggiungi pulsanti increment/decrement

**Criteri di successo**:
- [ ] Contatore funziona senza Zone.js
- [ ] Valori computed aggiornati automaticamente
- [ ] Nessun errore in console
- [ ] Performance ottimali (verifica con DevTools)

**Soluzione suggerita**:
```typescript
// counter.component.ts
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  
  increment() {
    this.count.update(v => v + 1);
  }
  
  decrement() {
    this.count.update(v => v - 1);
  }
}
```

---

### Esercizio 1.2: Signal Forms - Form di Login

**Obiettivo**: Creare un form di login completo con Signal Forms, validazioni e gestione errori.

**Passi**:

1. **Crea componente Login**
   ```bash
   ng generate component features/auth/login --standalone
   ```

2. **Implementa Signal Form**
   - Email: required, formato email valido
   - Password: required, minimo 6 caratteri
   - Mostra messaggi errore per ogni campo

3. **Gestisci Submit**
   - Disabilita form durante submit
   - Mostra loading state
   - Gestisci errori API

4. **Aggiungi validazione custom**
   - Password deve contenere almeno una maiuscola
   - Password deve contenere almeno un numero

**Criteri di successo**:
- [ ] Form validato correttamente
- [ ] Messaggi errore chiari
- [ ] Submit gestito con loading
- [ ] Integrazione con AuthService

**Soluzione suggerita**:
```typescript
// login.component.ts
export class LoginComponent {
  email = signal('');
  password = signal('');
  
  emailError = computed(() => {
    const email = this.email();
    if (!email) return 'Email obbligatoria';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email non valida';
    }
    return null;
  });
  
  passwordError = computed(() => {
    const pwd = this.password();
    if (!pwd) return 'Password obbligatoria';
    if (pwd.length < 6) return 'Minimo 6 caratteri';
    if (!/[A-Z]/.test(pwd)) return 'Almeno una maiuscola';
    if (!/\d/.test(pwd)) return 'Almeno un numero';
    return null;
  });
  
  isValid = computed(() => 
    !this.emailError() && !this.passwordError()
  );
  
  loading = signal(false);
  
  async onSubmit() {
    if (!this.isValid()) return;
    
    this.loading.set(true);
    try {
      await this.authService.login(
        this.email(),
        this.password()
      ).toPromise();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      // Gestisci errore
    } finally {
      this.loading.set(false);
    }
  }
}
```

---

### Esercizio 1.3: Control Flow Syntax

**Obiettivo**: Creare una lista prodotti usando @for, @if, @switch con gestione stati.

**Passi**:

1. **Crea componente ProductList**
   ```bash
   ng generate component features/products/product-list --standalone
   ```

2. **Implementa lista con @for**
   - Mostra lista prodotti
   - Gestisci empty state con @if
   - Aggiungi loading state

3. **Usa @switch per status badge**
   - Status: 'active', 'inactive', 'pending'
   - Colori diversi per ogni status

4. **Aggiungi filtri**
   - Filtra per categoria
   - Filtra per prezzo
   - Usa computed() per filtri

**Criteri di successo**:
- [ ] @for implementato correttamente
- [ ] @if per loading/empty states
- [ ] @switch per status
- [ ] Filtri funzionanti

**Soluzione suggerita**:
```typescript
// product-list.component.ts
export class ProductListComponent {
  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string | null>(null);
  
  filteredProducts = computed(() => {
    const products = this.products();
    const category = this.selectedCategory();
    
    if (!category) return products;
    return products.filter(p => p.category === category);
  });
  
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
```

```html
<!-- product-list.component.html -->
@if (loading()) {
  <div>Caricamento...</div>
} @else if (filteredProducts().length === 0) {
  <div>Nessun prodotto trovato</div>
} @else {
  @for (product of filteredProducts(); track product.id) {
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
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
  }
}
```

---

## 🏗️ Livello 2: Architettura

### Esercizio 2.1: Core Services e Interceptors

**Obiettivo**: Creare servizi core e HTTP interceptors per gestione centralizzata.

**Passi**:

1. **Crea AuthService**
   - Gestisci token JWT con Signals
   - Metodi: login(), logout(), isAuthenticated()
   - Salva token in localStorage

2. **Crea JWT Interceptor**
   - Aggiungi token a tutte le richieste
   - Gestisci refresh token (opzionale)

3. **Crea Error Interceptor**
   - Gestisci errori 401 (redirect login)
   - Gestisci errori 403, 404, 500
   - Mostra notifiche utente

4. **Crea Loading Interceptor**
   - Mostra loading globale durante richieste
   - Usa Signals per stato loading

**Criteri di successo**:
- [ ] Token aggiunto automaticamente
- [ ] Errori gestiti centralmente
- [ ] Loading state globale
- [ ] Test scritti per ogni servizio

**Soluzione suggerita**:
```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(
    localStorage.getItem('token')
  );
  
  readonly isAuthenticated = computed(() => 
    !!this.token()
  );
  
  login(email: string, password: string): Observable<string> {
    return this.http.post<{ token: string }>('/api/login', {
      email,
      password
    }).pipe(
      tap(response => {
        this.token.set(response.token);
        localStorage.setItem('token', response.token);
      }),
      map(response => response.token)
    );
  }
  
  logout(): void {
    this.token.set(null);
    localStorage.removeItem('token');
  }
  
  getToken(): string | null {
    return this.token();
  }
}
```

```typescript
// jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

---

### Esercizio 2.2: Feature Module con Lazy Loading

**Obiettivo**: Creare modulo Products completo con lazy loading.

**Passi**:

1. **Crea struttura feature**
   ```
   products/
   ├── products.routes.ts
   ├── components/
   │   ├── product-list/
   │   ├── product-detail/
   │   └── product-form/
   ├── services/
   │   └── product.service.ts
   └── models/
       └── product.model.ts
   ```

2. **Configura routing lazy-loaded**
   - Route: `/products` -> lista
   - Route: `/products/:id` -> dettaglio
   - Route: `/products/new` -> crea nuovo

3. **Implementa ProductService**
   - CRUD completo
   - Gestione errori
   - Cache con Signals

4. **Crea componenti**
   - ProductList: lista con paginazione
   - ProductDetail: dettaglio prodotto
   - ProductForm: form creazione/modifica

**Criteri di successo**:
- [ ] Lazy loading funzionante
- [ ] Routing configurato
- [ ] CRUD completo
- [ ] Componenti standalone

**Soluzione suggerita**:
```typescript
// products.routes.ts
export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: 'new',
    component: ProductFormComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  },
  {
    path: ':id/edit',
    component: ProductFormComponent
  }
];
```

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes')
      .then(m => m.PRODUCT_ROUTES)
  }
];
```

---

### Esercizio 2.3: Shared Components con Angular ARIA

**Obiettivo**: Creare libreria componenti riutilizzabili accessibili.

**Passi**:

1. **Crea Button Component**
   - Varianti: primary, secondary, danger
   - Stati: default, loading, disabled
   - ARIA attributes

2. **Crea Modal Component**
   - Usa Angular ARIA
   - Focus trap
   - Keyboard navigation (ESC per chiudere)

3. **Crea Card Component**
   - Header, body, footer slots
   - Accessibile

4. **Crea Loading Spinner**
   - Animazione accessibile
   - ARIA live region

**Criteri di successo**:
- [ ] Componenti accessibili
- [ ] Keyboard navigation
- [ ] Screen reader friendly
- [ ] Styling consistente

**Soluzione suggerita**:
```typescript
// button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [class]="'btn btn-' + variant"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      [attr.aria-disabled]="disabled()"
    >
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  disabled = signal(false);
  loading = signal(false);
}
```

---

## 🚀 Livello 3: Avanzato

### Esercizio 3.1: State Management con Signals

**Obiettivo**: Creare store pattern con Signals per gestione stato globale.

**Passi**:

1. **Crea Store Service generico**
   - Pattern Store<T>
   - Metodi: setState, updateState, select

2. **Implementa ProductStore**
   - State: products, loading, error
   - Actions: loadProducts, addProduct, updateProduct, deleteProduct

3. **Crea Selectors**
   - Usa computed() per selettori
   - Selector per prodotti attivi
   - Selector per prodotti per categoria

4. **Confronta con NgRx** (opzionale)
   - Pro e contro
   - Quando usare quale

**Criteri di successo**:
- [ ] Store pattern implementato
- [ ] State immutabile
- [ ] Selectors efficienti
- [ ] Test completi

---

### Esercizio 3.2: Testing Completo

**Obiettivo**: Scrivere test completi per componenti, servizi e integrazione.

**Passi**:

1. **Unit Test Componenti**
   - Test rendering
   - Test interazioni utente
   - Test Signals

2. **Unit Test Servizi**
   - Test HTTP calls
   - Test Signals
   - Test error handling

3. **Integration Test**
   - Test flusso completo
   - Test routing
   - Test guard

4. **E2E Test**
   - Test login flow
   - Test CRUD operations
   - Test accessibilità

**Criteri di successo**:
- [ ] Coverage > 80%
- [ ] Test veloci (< 5s)
- [ ] Test isolati
- [ ] E2E test funzionanti

---

### Esercizio 3.3: Performance Optimization

**Obiettivo**: Ottimizzare performance dell'applicazione.

**Passi**:

1. **Implementa OnPush Strategy**
   - Applica a tutti i componenti presentazionali
   - Verifica change detection

2. **Lazy Loading Completo**
   - Tutte le feature lazy-loaded
   - Preloading strategy

3. **Code Splitting**
   - Analizza bundle
   - Ottimizza imports
   - Tree shaking

4. **Performance Monitoring**
   - Lighthouse score
   - Bundle analyzer
   - Performance budgets

**Criteri di successo**:
- [ ] Lighthouse score > 90
- [ ] Bundle size ottimizzato
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

---

## ✅ Checklist Finale

Prima di considerare completato il percorso, verifica:

- [ ] Tutti gli esercizi Livello 1 completati
- [ ] Tutti gli esercizi Livello 2 completati
- [ ] Almeno 2 esercizi Livello 3 completati
- [ ] Backend integrato e funzionante
- [ ] Test coverage > 70%
- [ ] Performance ottimizzate
- [ ] Codice documentato
- [ ] Best practice applicate

**Congratulazioni!** 🎉 Sei pronto per sviluppare applicazioni Angular 21 professionali.
