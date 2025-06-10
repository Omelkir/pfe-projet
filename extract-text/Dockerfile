# Étape 1 : utiliser une image officielle Node.js
FROM node:20-slim

# Étape 2 : définir le dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 : copier les fichiers nécessaires
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install

# Étape 5 : copier le reste du code
COPY . .

# Étape 6 : exposer le port utilisé par Express
EXPOSE 5001

# Étape 7 : démarrer l'application
CMD ["node", "index.js"]
