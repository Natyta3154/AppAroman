# ---------------------------
# Etapa 1: Construcción (build)
# ---------------------------
FROM node:20-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Compilar la app (Vite genera la carpeta dist)
RUN npm run build

# ---------------------------
# Etapa 2: Servidor Nginx
# ---------------------------
FROM nginx:stable-alpine

# Copiar los archivos compilados al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80 (el default de Nginx)
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
