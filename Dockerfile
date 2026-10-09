# syntax=docker/dockerfile:1
#
# Imagen de snd-react-base (React TS): compila la aplicación y la sirve como archivos estáticos con nginx.
# Puerto: 5000 (el que espera .gitlab/auto-deploy-values.yaml).
#
#   docker build -t snd-react-base .
#   docker run --rm -p 5000:5000 snd-react-base      # http://localhost:5000

# ---------- Etapa 1: compilación ----------
# Versión de Node fijada (la misma con la que se probó el proyecto). Los requisitos mínimos de las herramientas
# son: Vite >= 22.12, Angular CLI >= 22.12 y jsdom (pruebas) 22.22.2 o 24.15 en adelante, por lo que una
# imagen 22.x anterior a 22.22.2 hace fallar la instalación de dependencias (yarn install).
FROM node:24.21.0-slim AS build
WORKDIR /app

# Primero solo los manifiestos: la capa de dependencias se reutiliza mientras no cambien.
COPY package.json yarn.lock ./
# --frozen-lockfile: falla si yarn.lock no coincide con package.json, en lugar de resolver versiones nuevas.
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- Etapa 2: servidor estático ----------
# nginx-unprivileged corre como usuario sin privilegios (no root) y no necesita permisos para el puerto 5000.
FROM nginxinc/nginx-unprivileged:1.30-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5000
# El comando por defecto de la imagen base (nginx en primer plano) es el que se usa.
