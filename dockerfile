# ------------------------------
# Step 1: Build Angular frontend
# ------------------------------
FROM node:18 AS build
WORKDIR /app

# Copy frontend code
COPY Frontend ./Frontend
WORKDIR /app/Frontend

# Install only production dependencies is not needed here because we need build tools
RUN npm install

# Build Angular app for production
RUN npm run build 


# ------------------------------
# Step 2: Setup Express backend
# ------------------------------
FROM node:18
WORKDIR /app/Backend

# Copy only package.json and package-lock.json first
COPY Backend/package*.json ./

# Install production dependencies inside container
RUN npm install --production

# Copy the rest of the backend code
COPY Backend/. .

# Copy built Angular frontend from previous stage
COPY --from=build /app/Frontend/dist/Smart-Task-Collaboration-Platform-app/browser ./public

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
