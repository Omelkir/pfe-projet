FROM node:20.11.1-bullseye

WORKDIR /app

# Copier fichiers nécessaires au yarn install
COPY package.json yarn.lock ./

# Étape 2 : Installer sans postinstall
RUN yarn install --frozen-lockfile --ignore-scripts

# Copier le reste (y compris le fichier manquant)
COPY . .

# (Optionnel) Compiler les icônes si besoin
RUN yarn build:icons

# Supprimer ancien build
RUN rm -rf .next

# Compiler le projet Next.js
RUN yarn build

EXPOSE 3100

CMD ["yarn", "start"]
