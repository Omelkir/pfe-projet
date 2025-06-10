FROM node:20.11.1-bullseye

WORKDIR /app

# Installer les outils de compilation pour les dépendances natives
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Reconstruire les dépendances natives si nécessaire
RUN npm rebuild bcrypt --update-binary

# Copier le reste du code
COPY . .

EXPOSE 5001

CMD ["yarn", "start"]
