# -------- FRONTEND BUILD --------
    FROM node:18 AS frontend

    WORKDIR /app/client
    
    COPY client/package*.json ./
    RUN npm install
    
    COPY client ./
    RUN npm run build
    
    # -------- BACKEND BUILD --------
    FROM node:18 AS backend
    
    WORKDIR /app/server
    
    # Install backend dependencies
    COPY server/package*.json ./
    RUN npm install
    
    # Copy backend source code
    COPY server ./
    
    # Build backend TypeScript (outputs to dist/)
    RUN npm run build
    
    # Copy frontend dist to public folder inside server
    COPY --from=frontend /app/client/dist ./public
    
    # Expose port
    EXPOSE 3000
    
    # Start the server
    CMD ["node", "dist/index.js"]
    