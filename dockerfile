# -------- FRONTEND BUILD --------
    FROM node:18 AS frontend

    WORKDIR /app/client
    
    COPY client/package*.json ./
    RUN npm install
    
    COPY client ./
    RUN npm run build
    
    # -------- BACKEND BUILD --------
    FROM node:18 AS backend
    
    WORKDIR /app
    
    COPY server/package*.json ./server/
    RUN cd server && npm install
    
    COPY server ./server
    COPY --from=frontend /app/client/dist ./server/public
    
    WORKDIR /app/server
    
    RUN npm run build
    
    EXPOSE 3000
    
    CMD ["node", "dist/index.js"]
    