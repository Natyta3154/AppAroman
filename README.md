# AppAroman - E-Commerce de Sahumerios 🌿

**AppAroman** es una plataforma de comercio electrónico moderna, rápida y escalable especializada en la venta de sahumerios, fragancias y productos de aromaterapia. Está construida con una arquitectura de Frontend de vanguardia enfocada en el rendimiento, la experiencia de usuario (UX) y el diseño visual (UI).

---

## 🚀 Tecnologías y Arquitectura

El proyecto está desarrollado utilizando un stack tecnológico moderno, asegurando un excelente rendimiento y facilidad de mantenimiento:

- **Framework Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (con Fast Refresh mediante SWC/Babel)
- **Estilos y UI**: [Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism UI (difuminados de cristal)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) para transiciones de página fluidas y micro-interacciones (hover, scroll).
- **Gestión del Estado**: [Zustand](https://zustand-demo.pmnd.rs/) (para un manejo global del carrito y la sesión de forma ligera).
- **Peticiones HTTP**: [Axios](https://axios-http.com/) (Instancia centralizada con interceptores para inyectar tokens JWT).
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)

---

## 📁 Estructura del Proyecto

El código fuente en la carpeta `src/` está organizado de manera modular para separar responsabilidades y facilitar la escalabilidad:

```text
src/
├── admin/          # Paneles y vistas de administración (Gestión de usuarios, productos, ofertas, posts)
├── assets/         # Recursos estáticos (imágenes, iconos, logos)
├── components/     # Componentes reutilizables de UI (Navbar, Footer, Hero, CarritoUI, etc.)
├── context/        # Contextos de React para datos globales (Ej. CarritoContext, AuthContext)
├── hooks/          # Custom Hooks de React para encapsular la lógica de negocio y llamadas a la API
├── pages/          # Vistas de página completa (Home, Productos, Contacto, Perfil, Login, Registro)
├── routes/         # Componentes de protección de rutas (AdminRoute, ProtectedRoute)
├── store/          # Stores de Zustand para manejo de estados globales
├── types/          # Interfaces y tipos de TypeScript para un tipado estricto
└── utils/          # Utilidades globales (Ej. api.ts para llamadas a backend, conversores de moneda)
```

---

## ⚙️ Cómo Funciona el Código (Conceptos Clave)

### 1. Conexión con el Backend (`src/utils/api.ts`)
Todas las llamadas al backend pasan por un **cliente Axios centralizado**. Esto significa que:
- La URL base de la API se lee dinámicamente de la variable de entorno `VITE_API_URL` (para cambiar fácilmente entre desarrollo `http://localhost:8080` y producción `https://apisahumerios.onrender...`).
- Los interceptores manejan los **Tokens de Autenticación** automáticamente, añadiendo el header `Authorization: Bearer <token>` a las solicitudes protegidas, sin tener que escribirlo en cada hook.

### 2. Custom Hooks (`src/hooks/`)
La lógica de adquisición de datos (Data Fetching) está completamente abstraída de la interfaz gráfica a través de hooks personalizados. 
- Por ejemplo, `useProductosDestacado.ts` hace la petición HTTP, maneja el estado de carga (`loading`) y captura posibles errores (`error`). La interfaz de usuario (como `Home.tsx`) solo se encarga de renderizar la información obtenida de estos hooks.

### 3. Diseño Modular y Glassmorphism
El sistema de diseño utiliza variables de marca centralizadas en `tailwind.config.cjs` (como `brand-primary`, `brand-light`). En el `Home.tsx` y las tarjetas de productos, se emplean clases de Tailwind de nivel avanzado como `backdrop-blur-md` junto con fondos semitransparentes para lograr un efecto moderno tipo "cristal" (Glassmorphism).

---

## 🛠️ Configuración e Instalación

### Requisitos Previos
- Node.js (v18+)
- NPM o Yarn

### Paso a paso para Desarrollo Local

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Configura las variables de entorno:
   Asegúrate de que el archivo `.env` en la raíz del proyecto apunte a tu servidor backend:
   ```env
   VITE_API_URL=http://localhost:8080   # Para desarrollo local
   # VITE_API_URL=https://tu-api.onrender.com # Para producción
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:9002`.

---

## 🐳 Despliegue con Docker

El proyecto está preparado para contenerizarse fácilmente con Docker para asegurar entornos consistentes.

1. **Construir la imagen**:
   ```bash
   docker build -t ecommerce_pro .
   ```

2. **Correr el contenedor** (Mapeando el puerto 9002):
   ```bash
   docker run -d -p 9002:80 ecommerce_pro
   ```

---
*Hecho con ♥ para AppAroman.*