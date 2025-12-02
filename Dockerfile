FROM node:24-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source files
COPY . .

# Build NestJS app
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy build output from build stage
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]