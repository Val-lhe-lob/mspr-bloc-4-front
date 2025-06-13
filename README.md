
# PayeTonKahwa – Frontend MSPR Bloc 4

Bienvenue dans le projet frontend React développé dans le cadre du MSPR Bloc 4.  
Ce projet a pour objectif de proposer une boutique en ligne moderne de vente de café avec une interface client et un tableau de bord administrateur (dashboard).

---

## Technologies utilisées

- React.js avec Vite pour un développement rapide et moderne
- Tailwind CSS pour le style responsive et customisable
- React Router pour la gestion des routes
- React Context API pour le panier global
- Axios pour les appels API
- Chart.js + react-chartjs-2 pour les graphiques
- MockAPI.io pour la simulation d’API REST

---

## Structure du projet

src/
│
├── assets/                   # Images, logos, etc.
├── components/              # Composants partagés
│   ├── admin/               # Composants du dashboard admin
│   └── homeComponents/      # Composants de la page d’accueil
│
├── context/                 # Contexte global (panier)
├── pages/
│   ├── admin/               # Pages administrateur
│   └── clients/             # Pages accessibles au client
│
├── App.jsx                  # Point d’entrée principal
└── main.jsx                 # Configuration React/Vite

---

## Fonctionnalités

### Côté Client
- Page d’accueil responsive avec scrolling fluide
- Affichage dynamique du catalogue via API
- Panier global avec aperçu flottant
- Validation de commande avec formulaire
- Affichage du récapitulatif de commande
- Historique temporaire des commandes

### Côté Admin
- Dashboard commercial avec KPIs :
  - Nombre total de produits
  - Nombre de commandes
  - Nombre de clients
  - Chiffre d’affaires
  - Évolution mensuelle du CA
  - Top produits vendus
- Interface de gestion (CRUD) :
  - Produits
  - Commandes
  - Clients

---

## APIs utilisées

- MockAPI - Products: https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products
- MockAPI - Orders: https://615f5fb4f7254d0017068109.mockapi.io/api/v1/orders
- MockAPI - Customers: https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers

---

## Lancer le projet

### Prérequis
- Node.js >= 16
- npm

### Installation

git clone https://github.com/Val-lhe-lob/mspr-bloc-4-front.git
cd mspr-bloc-4-front
npm install

### Lancer le serveur de dev

npm run dev

---

## Dépendances principales

npm install react-router-dom axios chart.js react-chartjs-2

---

## Auteurs

- Maamoune DJOUIMAA – Développeur Frontend
- Équipe MSPR TPRE814 – EPSI Lyon

---

## Licence

Ce projet est réalisé dans un cadre pédagogique (EPSI). Toute réutilisation est libre à des fins d’apprentissage uniquement.
