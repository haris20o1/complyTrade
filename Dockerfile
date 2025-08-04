# # Stage 1: Build the app
# FROM node:18 AS builder

# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source code and build
# COPY . .
# RUN npm run build

# # Stage 2: Serve using a Node.js static server
# FROM node:18-alpine

# WORKDIR /app

# # Install static file server globally
# RUN npm install -g serve

# # Copy built files from builder stage
# COPY --from=builder /app/dist .

# # Expose port
# EXPOSE 3000

# # Start the app
# CMD ["serve", "-s", ".", "-l", "3000"]


# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]