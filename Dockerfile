# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built assets
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY package.json ./
COPY app.json ./

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
