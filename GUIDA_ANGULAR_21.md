# 🚀 Guida Completa Angular 21 - Best Practice & Esercizi

## 📋 Indice
1. [Nuove Feature di Angular 21](#nuove-feature)
2. [Best Practice Architetturali](#best-practice)
3. [Struttura del Progetto](#struttura)
4. [Esercizi Progressivi](#esercizi)
5. [Pattern e Anti-Pattern](#pattern)

---

## 🆕 Nuove Feature di Angular 21 {#nuove-feature}

### 1. Signal Forms
**Cosa sono**: Nuova API per gestire i form basata su Signals, più leggera, tipizzata e con meno boilerplate.

**Vantaggi**:
- Type-safe per default
- Meno codice boilerplate
- Integrazione nativa con Signals
- Performance migliori

**Quando usare**: Sostituisce `FormBuilder` e `FormGroup` per nuovi form.

### 2. Zoneless Change Detection
**Cosa è**: Rimozione di Zone.js come default, usando Signals per il change detection.

**Vantaggi**:
- Bundle size ridotto (~50KB)
- Performance migliori
- Controllo esplicito del change detection

**Quando usare**: Default nei nuovi progetti Angular 21.

### 3. Angular ARIA (Developer Preview)
**Cosa è**: Libreria di componenti headless, semantici e accessibili.

**Vantaggi**:
- Accessibilità built-in
- Componenti riutilizzabili
- Supporto screen reader

### 4. Control Flow Syntax (@if, @for, @switch)
**Cosa è**: Nuova sintassi per template, più performante e leggibile.

**Vantaggi**:
- Sintassi più pulita
- Performance migliori
- Type checking migliore

### 5. Vitest come Test Runner
**Cosa è**: Sostituisce Jasmine/Karma con Vitest.

**Vantaggi**:
- Più veloce
- Migliore integrazione con TypeScript
- Mock più semplici

---

## 🏗️ Best Practice Architetturali {#best-practice}

### 1. Struttura Modulistica

```
src/
├── app/
│   ├── core/              # Servizi singleton, guard, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/            # Componenti, direttive, pipe riutilizzabili
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/          # Moduli feature-based
│   │   ├── auth/
│   │   ├── products/
│   │   └── users/
│   └── layout/            # Componenti layout (header, footer, sidebar)
```

**Regole**:
- **Core**: Servizi che devono essere istanziati una sola volta
- **Shared**: Componenti riutilizzabili senza logica di business
- **Features**: Moduli completi con routing lazy-loaded
- **Layout**: Componenti strutturali

### 2. Tipizzazione Rigorosa

```typescript
// ✅ BENE
interface User {
  id: number;
  email: string;
  name: string;
}

function getUser(id: number): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`);
}

// ❌ MALE
function getUser(id: any): any {
  return this.http.get(`/api/users/${id}`);
}
```

**Configurazione `tsconfig.json`**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 3. Change Detection Strategy

```typescript
// ✅ Usa OnPush per componenti "dumb"
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

**Quando usare OnPush**:
- Componenti presentazionali
- Input immutabili
- Output event-driven

### 4. Signals vs RxJS

**Signals**: Per stato locale, semplice, sincrono
```typescript
count = signal(0);
doubleCount = computed(() => this.count() * 2);
```

**RxJS**: Per operazioni asincrone, stream complessi
```typescript
products$ = this.http.get<Product[]>('/api/products');
```

### 5. Lazy Loading

```typescript
// ✅ Lazy loading per feature modules
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
}
```

---

## 📁 Struttura del Progetto {#struttura}

### Core Module
Servizi globali, guard, interceptors.

**Esempio Core Service**:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(null);
  
  login(email: string, password: string): Observable<string> {
    // logica login
  }
}
```

### Shared Module
Componenti riutilizzabili senza dipendenze di business.

**Esempio Shared Component**:
```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button [class]="variant">{{ label }}</button>`
})
export class ButtonComponent {
  @Input() label!: string;
  @Input() variant: 'primary' | 'secondary' = 'primary';
}
```

### Feature Modules
Moduli completi con routing, componenti, servizi.

**Esempio Feature Structure**:
```
products/
├── products.routes.ts
├── components/
│   ├── product-list/
│   └── product-detail/
├── services/
│   └── product.service.ts
└── models/
    └── product.model.ts
```

---

## 🎯 Esercizi Progressivi {#esercizi}

### Livello 1: Fondamenta

#### Esercizio 1.1: Setup Zoneless
**Obiettivo**: Configurare un progetto Angular 21 con Zoneless change detection.

**Task**:
1. Creare nuovo progetto con `ng new`
2. Abilitare Zoneless in `main.ts`
3. Creare componente contatore con Signals
4. Verificare che funzioni senza Zone.js

**Checklist**:
- [ ] Progetto creato
- [ ] Zoneless abilitato
- [ ] Contatore funzionante
- [ ] Nessun errore in console

#### Esercizio 1.2: Signal Forms Base
**Obiettivo**: Creare form di login con Signal Forms.

**Task**:
1. Creare componente `LoginComponent`
2. Implementare form con Signal Forms
3. Validazioni: email required, password min 6 caratteri
4. Submit con gestione errori

**Checklist**:
- [ ] Form creato con Signal Forms
- [ ] Validazioni funzionanti
- [ ] Messaggi errore visualizzati
- [ ] Submit gestito correttamente

#### Esercizio 1.3: Control Flow Syntax
**Obiettivo**: Usare @if, @for, @switch nei template.

**Task**:
1. Creare lista prodotti con @for
2. Usare @if per loading state
3. Usare @switch per status badge
4. Gestire empty state

**Checklist**:
- [ ] @for implementato
- [ ] @if per loading
- [ ] @switch per status
- [ ] Empty state gestito

### Livello 2: Architettura

#### Esercizio 2.1: Core Services
**Obiettivo**: Creare servizi core (Auth, HTTP Interceptor).

**Task**:
1. Creare `AuthService` con Signals
2. Creare `HttpInterceptor` per JWT
3. Creare `ErrorInterceptor` per gestione errori
4. Testare con chiamate API

**Checklist**:
- [ ] AuthService funzionante
- [ ] JWT aggiunto automaticamente
- [ ] Errori gestiti centralmente
- [ ] Test scritti

#### Esercizio 2.2: Feature Module con Lazy Loading
**Obiettivo**: Creare modulo Products con lazy loading.

**Task**:
1. Creare feature module `products`
2. Configurare routing lazy-loaded
3. Implementare ProductService
4. Creare ProductList e ProductDetail

**Checklist**:
- [ ] Modulo creato
- [ ] Lazy loading funzionante
- [ ] Service implementato
- [ ] Componenti creati

#### Esercizio 2.3: Shared Components
**Obiettivo**: Creare libreria componenti riutilizzabili.

**Task**:
1. Creare Button, Card, Modal components
2. Usare Angular ARIA per accessibilità
3. Styling con CSS variables
4. Documentare con Storybook (opzionale)

**Checklist**:
- [ ] Componenti creati
- [ ] ARIA implementato
- [ ] Styling consistente
- [ ] Riutilizzabili

### Livello 3: Avanzato

#### Esercizio 3.1: State Management con Signals
**Obiettivo**: Gestire stato globale con Signals.

**Task**:
1. Creare store service con Signals
2. Implementare pattern Store per Products
3. Gestire loading, error, data states
4. Confrontare con NgRx (opzionale)

**Checklist**:
- [ ] Store service creato
- [ ] State gestito correttamente
- [ ] Loading/error states
- [ ] Performance ottimizzate

#### Esercizio 3.2: Testing Completo
**Obiettivo**: Scrivere test completi con Vitest.

**Task**:
1. Unit test per componenti
2. Unit test per servizi
3. Integration test per feature
4. E2E test per flusso completo

**Checklist**:
- [ ] Coverage > 80%
- [ ] Test componenti
- [ ] Test servizi
- [ ] E2E test

#### Esercizio 3.3: Performance Optimization
**Obiettivo**: Ottimizzare performance dell'app.

**Task**:
1. Implementare OnPush strategy
2. Lazy loading completo
3. Code splitting
4. Bundle analysis

**Checklist**:
- [ ] OnPush applicato
- [ ] Bundle size ottimizzato
- [ ] Lighthouse score > 90
- [ ] Performance monitorate

---

## 🎨 Pattern e Anti-Pattern {#pattern}

### ✅ Pattern Consigliati

#### 1. Container/Presentational Pattern
```typescript
// Container (Smart Component)
@Component({
  template: `
    <app-product-list 
      [products]="products()"
      (select)="onSelect($event)"
    />
  `
})
export class ProductContainerComponent {
  products = signal<Product[]>([]);
  
  onSelect(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
}

// Presentational (Dumb Component)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  @Input() products!: Product[];
  @Output() select = new EventEmitter<Product>();
}
```

#### 2. Service Layer Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = signal<Product[]>([]);
  private loading = signal(false);
  
  readonly products$ = this.products.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  
  loadProducts(): void {
    this.loading.set(true);
    this.http.get<Product[]>('/api/products')
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
```

#### 3. Guard Pattern
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
```

### ❌ Anti-Pattern da Evitare

#### 1. ❌ Mutazioni Dirette dello State
```typescript
// ❌ MALE
this.products.push(newProduct);

// ✅ BENE
this.products.update(ps => [...ps, newProduct]);
```

#### 2. ❌ Subscription non Gestite
```typescript
// ❌ MALE
ngOnInit() {
  this.service.getData().subscribe(data => {
    this.data = data;
  });
}

// ✅ BENE
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.data = data;
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### 3. ❌ Logica nel Template
```typescript
// ❌ MALE
<div>{{ calculateTotal() }}</div>

// ✅ BENE
total = computed(() => this.items().reduce((sum, item) => sum + item.price, 0));
<div>{{ total() }}</div>
```

---

## 🔧 Configurazioni Importanti

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### angular.json (Ottimizzazioni)
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    }
  ],
  "optimization": true,
  "outputHashing": "all",
  "sourceMap": false
}
```

---

## 📚 Risorse Aggiuntive

- [Angular Official Docs](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular ARIA](https://angular.dev/guide/accessibility)
- [Vitest Documentation](https://vitest.dev)

---

## 🎓 Prossimi Passi

1. Completa tutti gli esercizi del Livello 1
2. Implementa le feature del backend
3. Integra frontend e backend
4. Aggiungi test completi
5. Deploy su piattaforma cloud

**Ricorda**: La pratica costante è la chiave. Ogni esercizio ti porta più vicino alla padronanza di Angular 21.
