# Application de Gestion d'Entreprise

Cette application permet de gérer les fournisseurs, commandes, factures et projets d'une entreprise.

## Technologies utilisées

- React avec TypeScript
- Tailwind CSS pour le style
- Supabase pour la base de données et le stockage
- Vite comme bundler

## Configuration

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Un compte Supabase

### Configuration de Supabase

1. Créez un compte sur [Supabase](https://supabase.com/)
2. Créez un nouveau projet
3. Dans l'éditeur SQL, exécutez les requêtes suivantes pour créer les tables nécessaires :

```sql
-- Création de la table des fournisseurs
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  bankInfo TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des projets
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  startDate DATE NOT NULL,
  endDate DATE,
  status TEXT CHECK (status IN ('en cours', 'terminé', 'en pause', 'annulé')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des commandes
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderNumber TEXT NOT NULL,
  date DATE NOT NULL,
  supplierId INTEGER REFERENCES suppliers(id),
  projectId INTEGER REFERENCES projects(id),
  status TEXT CHECK (status IN ('en attente', 'envoyée', 'reçue', 'partiellement reçue')),
  totalHT DECIMAL(10, 2) NOT NULL,
  tva DECIMAL(10, 2) NOT NULL,
  totalTTC DECIMAL(10, 2) NOT NULL,
  paymentDueDate DATE NOT NULL,
  paymentStatus TEXT CHECK (paymentStatus IN ('non payé', 'payé', 'partiellement payé')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des factures
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoiceNumber TEXT NOT NULL,
  invoiceDate DATE NOT NULL,
  orderId INTEGER REFERENCES orders(id),
  amount DECIMAL(10, 2) NOT NULL,
  paymentTerms TEXT,
  dueDate DATE NOT NULL,
  paymentStatus TEXT CHECK (paymentStatus IN ('en attente', 'payé', 'partiellement payé')),
  pdfUrl TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un bucket pour stocker les factures PDF
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', true);
```

4. Récupérez votre URL Supabase et votre clé anonyme depuis les paramètres du projet
5. Créez un fichier `.env` à la racine du projet avec ces informations :

```
VITE_SUPABASE_URL=https://sebgbxvcrsobjblbiuxz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYmdieHZjcnNvYmpibGJpdXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDI4MjksImV4cCI6MjA1NjU3ODgyOX0.rVfHsbXniM8FtQZ5J64INHlBGbol_AZ_wGgA7PR7ND8
```

### Installation

1. Clonez ce dépôt
2. Installez les dépendances :
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```
3. Lancez l'application en mode développement :
   ```
   npm run dev
   ```
   ou
   ```
   yarn dev
   ```

## Déploiement sur Netlify

1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Connectez votre dépôt GitHub à Netlify
3. Configurez les variables d'environnement dans les paramètres du site Netlify :
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Configurez les paramètres de build :
   - Build command : `npm run build` ou `yarn build`
   - Publish directory : `dist`
5. Déployez votre site

## Fonctionnalités

- Gestion des fournisseurs
- Gestion des projets
- Gestion des commandes
- Gestion des factures
- Importation de factures PDF
- Suivi des paiements
- Alertes pour les paiements en retard ou à échéance proche