# 🚀 Angular 21 Starter - Progetto Completo con Backend

Progetto completo per imparare Angular 21 con best practice, esercizi progressivi e backend Node.js integrato.

## 📋 Contenuti

- ✅ **Guida Completa Angular 21** (`GUIDA_ANGULAR_21.md`) - Best practice e pattern
- ✅ **Esercizi Progressivi** (`ESERCIZI.md`) - Esercizi step-by-step
- ✅ **Frontend Angular 21** - Progetto completo con:
  - Zoneless Change Detection
  - Signal Forms
  - Control Flow Syntax (@if, @for, @switch)
  - Lazy Loading
  - Core Services & Interceptors
  - Feature Modules
- ✅ **Backend Node.js** - API REST con:
  - Express.js
  - SQLite Database
  - JWT Authentication
  - CRUD completo

## 🏗️ Struttura del Progetto

```
.
├── frontend/              # Applicazione Angular 21
│   ├── src/
│   │   └── app/
│   │       ├── core/      # Servizi, guard, interceptors
│   │       ├── shared/   # Componenti riutilizzabili
│   │       ├── features/ # Moduli feature-based
│   │       └── layout/   # Componenti layout
│   └── package.json
├── backend/              # API Node.js + Express
│   ├── server.js
│   └── package.json
├── GUIDA_ANGULAR_21.md   # Guida completa
├── ESERCIZI.md          # Esercizi progressivi
└── README.md            # Questo file
```

## 🚀 Quick Start

### Prerequisiti

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI 21 (verrà installato automaticamente)

### 1. Setup Backend

```bash
cd backend
npm install
npm start
```

Il backend sarà disponibile su `http://localhost:3000`

**Credenziali di default:**
- Email: `admin@example.com`
- Password: `admin123`

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Il frontend sarà disponibile su `http://localhost:4200`

**Nota**: Il frontend è configurato con proxy per le API (`proxy.conf.json`).

## 📚 Come Usare Questo Progetto

### Per Principianti

1. **Leggi la Guida**: Inizia con `GUIDA_ANGULAR_21.md`
   - Capisci le nuove feature di Angular 21
   - Impara le best practice
   - Studia i pattern consigliati

2. **Completa gli Esercizi**: Segui `ESERCIZI.md` in ordine
   - Livello 1: Fondamenta (Zoneless, Signal Forms, Control Flow)
   - Livello 2: Architettura (Services, Lazy Loading, Shared Components)
   - Livello 3: Avanzato (State Management, Testing, Performance)

3. **Esplora il Codice**: 
   - Studia la struttura del progetto
   - Leggi i commenti nel codice
   - Modifica e sperimenta

### Per Sviluppatori Esperti

- Analizza l'architettura modulare
- Studia l'implementazione di Signals
- Verifica le ottimizzazioni di performance
- Confronta con le tue implementazioni

## 🎯 Feature Implementate

### Frontend

- ✅ **Autenticazione JWT**
  - Login/Register
  - Guard per route protette
  - Interceptor per token automatico

- ✅ **Gestione Prodotti (CRUD)**
  - Lista prodotti con filtri
  - Dettaglio prodotto
  - Creazione/Modifica prodotto
  - Eliminazione prodotto

- ✅ **Esempi Angular 21**
  - Counter con Zoneless Change Detection
  - Signal Forms (esempio base)
  - Control Flow Syntax (@if, @for, @switch)
  - Signals e Computed values

- ✅ **Architettura**
  - Core Services (AuthService)
  - HTTP Interceptors (JWT, Error)
  - Feature Modules con Lazy Loading
  - Shared Components

### Backend

- ✅ **API REST**
  - `/api/login` - Autenticazione
  - `/api/register` - Registrazione
  - `/api/me` - Utente corrente
  - `/api/products` - CRUD prodotti
  - `/api/categories` - Lista categorie

- ✅ **Sicurezza**
  - JWT Token
  - Password hashing (bcrypt)
  - Validazione input
  - Middleware autenticazione

- ✅ **Database**
  - SQLite (facile da usare, file-based)
  - Schema Users e Products
  - Relazioni foreign key

## 📖 Documentazione

### Guide Disponibili

1. **GUIDA_ANGULAR_21.md**
   - Nuove feature Angular 21
   - Best practice architetturali
   - Pattern e anti-pattern
   - Configurazioni importanti

2. **ESERCIZI.md**
   - Esercizi progressivi (3 livelli)
   - Criteri di successo
   - Soluzioni suggerite
   - Checklist finale

### API Documentation

#### Autenticazione

```typescript
POST /api/login
Body: { email: string, password: string }
Response: { token: string, user: User }

POST /api/register
Body: { email: string, password: string, name: string }
Response: { token: string, user: User }

GET /api/me
Headers: { Authorization: "Bearer <token>" }
Response: User
```

#### Prodotti

```typescript
GET /api/products?category=xxx&status=active
Headers: { Authorization: "Bearer <token>" }
Response: Product[]

GET /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Response: Product

POST /api/products
Headers: { Authorization: "Bearer <token>" }
Body: { name, description?, price, category, status? }
Response: Product

PUT /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Body: { name?, description?, price?, category?, status? }
Response: Product

DELETE /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Response: 204 No Content

GET /api/categories
Headers: { Authorization: "Bearer <token>" }
Response: string[]
```

## 🧪 Testing

### Backend

```bash
cd backend
# I test possono essere aggiunti con Jest o Mocha
```

### Frontend

```bash
cd frontend
npm test
```

**Nota**: Il progetto usa Vitest come test runner (configurazione Angular 21).

## 🔧 Configurazione

### Backend

Crea un file `.env` nella cartella `backend/`:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend

Il proxy per le API è già configurato in `proxy.conf.json`.

Per modificare la porta del backend, aggiorna:
- `frontend/proxy.conf.json` (target)
- `backend/.env` (PORT)

## 🎓 Percorso di Apprendimento

### Settimana 1: Fondamenta
- [ ] Leggi GUIDA_ANGULAR_21.md (sezioni 1-2)
- [ ] Completa Esercizio 1.1 (Zoneless)
- [ ] Completa Esercizio 1.2 (Signal Forms)
- [ ] Completa Esercizio 1.3 (Control Flow)

### Settimana 2: Architettura
- [ ] Completa Esercizio 2.1 (Core Services)
- [ ] Completa Esercizio 2.2 (Lazy Loading)
- [ ] Completa Esercizio 2.3 (Shared Components)
- [ ] Integra backend con frontend

### Settimana 3: Avanzato
- [ ] Completa Esercizio 3.1 (State Management)
- [ ] Completa Esercizio 3.2 (Testing)
- [ ] Completa Esercizio 3.3 (Performance)
- [ ] Aggiungi nuove feature personalizzate

## 🐛 Troubleshooting

### Backend non si avvia
- Verifica che la porta 3000 sia libera
- Controlla che Node.js sia installato correttamente
- Esegui `npm install` nella cartella backend

### Frontend non si connette al backend
- Verifica che il backend sia in esecuzione
- Controlla `proxy.conf.json`
- Verifica che la porta del backend corrisponda

### Errori di autenticazione
- Verifica che il token sia salvato in localStorage
- Controlla che il JWT_SECRET sia configurato
- Verifica le credenziali di default

## 📝 Note Importanti

1. **Angular 21**: Questo progetto usa Angular 21 con Zoneless change detection. Assicurati di avere Angular CLI 21.

2. **Database**: SQLite crea un file `database.sqlite` nella cartella backend. Puoi resettarlo eliminando il file.

3. **Sicurezza**: In produzione, cambia il JWT_SECRET e usa un database più robusto (PostgreSQL, MySQL).

4. **CORS**: Il backend è configurato per accettare richieste dal frontend. In produzione, configura CORS correttamente.

## 🚀 Prossimi Passi

Dopo aver completato gli esercizi base:

1. **Aggiungi Feature**:
   - Sistema di notifiche
   - Upload file
   - Ricerca avanzata
   - Paginazione

2. **Migliora Performance**:
   - Implementa OnPush strategy ovunque
   - Aggiungi virtual scrolling
   - Ottimizza bundle size

3. **Aggiungi Test**:
   - Unit test per componenti
   - Integration test
   - E2E test

4. **Deploy**:
   - Frontend: Vercel, Netlify, Firebase
   - Backend: Railway, Render, Heroku
   - Database: PostgreSQL su cloud

## 📄 Licenza

MIT License - Usa liberamente per apprendimento e progetti personali.

## 🤝 Contributi

Questo è un progetto educativo. Sentiti libero di:
- Segnalare bug
- Suggerire miglioramenti
- Condividere le tue implementazioni

## 📞 Supporto

Per domande o problemi:
1. Controlla la documentazione
2. Leggi i commenti nel codice
3. Consulta la guida Angular ufficiale

---

**Buon apprendimento! 🎉**

Ricorda: La pratica costante è la chiave per padroneggiare Angular 21.
