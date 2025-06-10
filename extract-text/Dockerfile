FROM node:20.11.1-bullseye
 
WORKDIR /app
 
# Install build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
 
# Copy dependency files first
COPY package.json yarn.lock ./
 
# Install all dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile --production=false
 
# Rebuild native dependencies
RUN npm rebuild bcrypt --update-binary
 
# Copy application code
COPY . .
 
# Install missing type definitions
RUN yarn add --dev @types/pdf-parse
 
# Build TypeScript to JavaScript
RUN yarn build
 
# Remove devDependencies after build
RUN yarn install --production
 
EXPOSE 5001
 
# Run the compiled JavaScript
CMD ["node", "dist/index.js"]
