# Descripción

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo `.env.example` y renombrarlo a `.env` y configurar variables de entorno
3. Instalar dependencias `npm install`
4. Levantar la base de datos `docker compose up -d`
5. Correr las migraciones de Prisma `npx prisma migrate dev`
6. Cargar la base de datos con datos de prueba `npm run seed`
7. Correr el proyecto `npm run dev`


## Correr en prod