# Backend Structure

## 📁 Struttura del Progetto

```
backend/
├── database/
│   └── db.js              # Configurazione database e inizializzazione schema
├── routes/
│   ├── auth.routes.js     # Route per autenticazione (login, register, me)
│   └── products.routes.js # Route per prodotti (CRUD)
├── middleware/
│   └── auth.middleware.js # Middleware per autenticazione JWT
└── server.js              # Entry point, configurazione Express e routing
```

## 🗄️ Database

### Inizializzazione

Le tabelle vengono create automaticamente all'avvio del server tramite `database/db.js`.

**Non è necessario** creare manualmente le tabelle - il sistema le crea automaticamente se non esistono.

### Schema

- **users**: Utenti del sistema
- **products**: Prodotti associati agli utenti

### Modificare lo Schema

Per aggiungere/modificare tabelle:

1. Modifica `database/db.js` nella funzione `initializeDatabase()`
2. Riavvia il server
3. Le modifiche verranno applicate automaticamente

## 🔄 Separazione Logica

### Database (`database/db.js`)
- Connessione al database
- Inizializzazione schema
- Helper functions per query

### Routes (`routes/`)
- Logica di business per ogni endpoint
- Validazione input
- Gestione errori

### Middleware (`middleware/`)
- Autenticazione JWT
- Altri middleware riutilizzabili

### Server (`server.js`)
- Configurazione Express
- Registrazione routes
- Error handling globale

## 🚀 Vantaggi di questa Struttura

1. **Manutenibilità**: Codice organizzato e facile da trovare
2. **Scalabilità**: Facile aggiungere nuove routes/moduli
3. **Testabilità**: Ogni modulo può essere testato separatamente
4. **Riusabilità**: Database helpers e middleware riutilizzabili

## 📝 Note

- Il database viene inizializzato automaticamente all'avvio
- Le tabelle vengono create solo se non esistono (`CREATE TABLE IF NOT EXISTS`)
- Il database SQLite viene creato nella root di `backend/`
