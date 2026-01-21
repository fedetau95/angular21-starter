# 🛠️ Setup Dettagliato del Progetto

Guida passo-passo per configurare e avviare il progetto Angular 21 + Backend Node.js.

## 📋 Prerequisiti

### Software Necessario

1. **Node.js** (versione 18.x o superiore)
   ```bash
   node --version
   # Dovrebbe mostrare v18.x.x o superiore
   ```

2. **npm** (versione 9.x o superiore)
   ```bash
   npm --version
   # Dovrebbe mostrare 9.x.x o superiore
   ```

3. **Angular CLI 21**
   ```bash
   npm install -g @angular/cli@21
   ng version
   # Verifica che sia la versione 21
   ```

## 🚀 Installazione

### Step 1: Setup Backend

```bash
# Vai nella cartella backend
cd backend

# Installa le dipendenze
npm install

# Crea file .env (opzionale, usa valori di default se non lo crei)
# Copia il contenuto di .env.example e modifica i valori
# PORT=3000
# JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Avvia il server
npm start

# Il server sarà disponibile su http://localhost:3000
```

**Verifica Backend:**
```bash
# In un altro terminale
curl http://localhost:3000/api/health
# Dovrebbe rispondere: {"status":"ok","timestamp":"..."}
```

### Step 2: Setup Frontend

```bash
# Torna alla root del progetto
cd ..

# Vai nella cartella frontend
cd frontend

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start

# Il frontend sarà disponibile su http://localhost:4200
```

**Nota**: Il frontend è configurato per fare proxy delle richieste API al backend su `http://localhost:3000`.

## 🔍 Verifica Installazione

### Test Backend

1. **Health Check**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test Login** (con credenziali default)
   ```bash
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```
   
   Dovresti ricevere un token JWT.

### Test Frontend

1. Apri `http://localhost:4200` nel browser
2. Dovresti vedere la pagina di login
3. Prova a fare login con:
   - Email: `admin@example.com`
   - Password: `admin123`

## 🐛 Risoluzione Problemi

### Problema: "Cannot find module '@angular/core'"

**Soluzione:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema: Backend non si avvia - "Port 3000 already in use"

**Soluzione:**
1. Trova il processo che usa la porta 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

2. Termina il processo o cambia la porta nel file `.env`:
   ```env
   PORT=3001
   ```

3. Aggiorna anche `frontend/proxy.conf.json`:
   ```json
   {
     "/api": {
       "target": "http://localhost:3001",
       ...
     }
   }
   ```

### Problema: Frontend non si connette al backend

**Soluzione:**
1. Verifica che il backend sia in esecuzione
2. Controlla `frontend/proxy.conf.json` - il target deve essere `http://localhost:3000`
3. Riavvia il frontend dopo aver modificato il proxy

### Problema: Errori CORS

**Soluzione:**
Il backend è già configurato con CORS. Se vedi errori:
1. Verifica che `cors` sia installato: `npm list cors` nella cartella backend
2. Controlla che il middleware CORS sia presente in `backend/server.js`

### Problema: Database non si crea

**Soluzione:**
1. Verifica i permessi di scrittura nella cartella `backend/`
2. Il file `database.sqlite` viene creato automaticamente al primo avvio
3. Se hai problemi, elimina il file e riavvia il server

## 🔧 Configurazione Avanzata

### Cambiare Porta Backend

1. Crea/modifica `backend/.env`:
   ```env
   PORT=3001
   ```

2. Aggiorna `frontend/proxy.conf.json`:
   ```json
   {
     "/api": {
       "target": "http://localhost:3001"
     }
   }
   ```

### Cambiare Porta Frontend

Modifica `frontend/angular.json`:
```json
"serve": {
  "options": {
    "port": 4201
  }
}
```

Oppure usa:
```bash
ng serve --port 4201
```

### Usare Database Diverso

Per usare PostgreSQL invece di SQLite:

1. Installa il driver:
   ```bash
   cd backend
   npm install pg
   ```

2. Modifica `backend/server.js` per usare PostgreSQL invece di SQLite
3. Configura la connessione nel file `.env`

## 📝 Note Importanti

1. **Angular 21**: Assicurati di avere Angular CLI 21. Se non è disponibile, usa l'ultima versione stabile disponibile.

2. **Database**: SQLite crea un file locale. Per reset:
   ```bash
   cd backend
   rm database.sqlite
   npm start
   ```

3. **Token JWT**: I token scadono dopo 24 ore. Fai logout e login per ottenere un nuovo token.

4. **Sviluppo**: Usa `npm run dev` nel backend per auto-reload con nodemon (se installato).

## ✅ Checklist Setup

- [ ] Node.js installato (v18+)
- [ ] npm installato (v9+)
- [ ] Angular CLI 21 installato
- [ ] Backend installato (`cd backend && npm install`)
- [ ] Frontend installato (`cd frontend && npm install`)
- [ ] Backend avviato e risponde su `/api/health`
- [ ] Frontend avviato e accessibile su `http://localhost:4200`
- [ ] Login funzionante con credenziali default
- [ ] Database SQLite creato

## 🎯 Prossimi Passi

Dopo aver completato il setup:

1. Leggi `GUIDA_ANGULAR_21.md` per capire le best practice
2. Inizia con gli esercizi in `ESERCIZI.md`
3. Esplora il codice del progetto
4. Modifica e sperimenta!

---

**Buon coding! 🚀**
