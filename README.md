# TesloShop 🛒

TesloShop es una aplicación de e-commerce desarrollada con Next.js, TypeScript, y Prisma, basada en el curso de Fernando Herrera. Este proyecto es una base sólida para aprender buenas prácticas en desarrollo web y explorar tecnologías modernas en el ecosistema JavaScript. 🚀

## 🚀 Características

- 🌐 Frontend moderno: Construido con Next.js para SSR, ISR y optimización de rendimiento.
- 🗄️ Base de datos robusta: Utilizando Prisma como ORM con integración en PostgreSQL.
- 🧩 Diseño modular: Código limpio y estructurado para facilitar la escalabilidad.
- 💾 Datos de prueba: Carga inicial para explorar funcionalidades sin configurar desde cero.
- 🛠️ Docker-ready: Simplifica la configuración de la base de datos con docker-compose.
- 🔒 Autenticación segura: Implementación de autenticación con JWT y cookies.
- 📦 Carrito de compras: Funcionalidad completa para agregar, eliminar y comprar productos.
- 📦 Checkout: Proceso de compra con pasos de envío, pago (Paypal) y confirmación.

## 🛠️ Configuración y ejecución en modo desarrollo

### Requisitos previos

- Node.js >= 16.x
- Docker y Docker Compose
- PostgreSQL (o usar el contenedor Docker provisto)

### Pasos para correr el proyecto

1. Clonar el repositorio
2. Crear una copia del archivo `.env.example` y renombrarlo a `.env` y configurar variables de entorno
3. Instalar dependencias `npm install`
4. Levantar la base de datos `docker compose up -d`
5. Correr las migraciones de Prisma `npx prisma migrate dev`
6. Cargar la base de datos con datos de prueba `npm run seed`
7. Correr el proyecto `npm run dev`
8. Accede a la aplicación: abre tu navegador y ve a http://localhost:3000.

## 📜 Licencia

Este proyecto se encuentra bajo la licencia MIT. ¡Siéntete libre de usarlo, modificarlo y compartirlo! ✨

## 🚀 Inspiración

Este proyecto fue desarrollado como parte del curso de Fernando Herrera. Agradecimientos al autor por su contenido educativo de calidad. 🙌