# 🚀 NextCollege Rapid Platform - CI/CD Demo con Dokploy

Plataforma multicapa de alto rendimiento diseñada para demostraciones en vivo de **Entrega Continua (CI/CD)** desde **GitHub** hacia **Dokploy** utilizando **Docker Multi-Stage**.

---

## 🏗️ Arquitectura de la Solución

El proyecto está compuesto por 4 capas sincronizadas servidas en un único contenedor y un solo puerto (`3000`):

| Capa | Ruta | Tecnología | Propósito |
| :--- | :--- | :--- | :--- |
| **Portal E-commerce** | `/` | **Astro (Static/SSG)** | Máximo SEO, Core Web Vitals y velocidad ultrarrápida. |
| **PWA Mobile** | `/app` | **React 18 + Vite** | Experiencia tipo app nativa, instalable, offline y touch. |
| **Panel Admin** | `/admin` | **React 18 + Vite** | Dashboard ejecutivo con métricas y gestión de catálogo. |
| **API REST Backend** | `/api/...` | **Node.js + Express** | Endpoints de productos, health check y conexión a MySQL. |

---

## ⚡ Pruebas Locales Inmediatas

### 1. Instalar dependencias en todas las capas:
```bash
npm run install:all
```

### 2. Compilar los 3 frontends:
```bash
npm run build:all
```

### 3. Iniciar el servidor backend:
```bash
npm start
```
Abre en tu navegador:
- **E-commerce:** [http://localhost:3000/](http://localhost:3000/)
- **PWA Mobile:** [http://localhost:3000/app](http://localhost:3000/app)
- **Panel Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Health:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

> *Nota: Si no configuras variables de MySQL, el servidor operará automáticamente en modo **In-Memory** con datos demo para que nunca falle la presentación.*

---

## 🐳 Despliegue en Dokploy (Paso a Paso)

### Paso 1: Crear la Base de Datos MySQL (Opcional pero Recomendado)
1. En tu panel de Dokploy, entra a tu Proyecto.
2. Pulsa **Create Service** > **Database** > **MySQL**.
3. Asigna nombre a la base de datos (ej. `app_db`), usuario y contraseña.
4. Anota el nombre interno de host que Dokploy le asigna en la red interna (ej. `mysql-service`).

### Paso 2: Crear la Aplicación
1. En Dokploy, pulsa **Create Service** > **Application**.
2. **Source:** Selecciona **Git**.
3. **Repository:** Conecta `PabloValdiviaM/Test_PWA_NextCollege_Rapid`.
4. **Branch:** `main`.
5. **Build Type:** Selecciona **Dockerfile**.
6. **Port:** `3000`.

### Paso 3: Variables de Entorno (Environment)
En la pestaña **Environment** de tu aplicación en Dokploy, configura:
```env
NODE_ENV=production
PORT=3000
DB_HOST=nombre-interno-de-tu-mysql-en-dokploy
DB_USER=root
DB_PASSWORD=tu_password_configurado
DB_NAME=app_db
DB_PORT=3306
```

### Paso 4: Activar Entrega Continua (Auto Deploy)
1. En Dokploy, dirígete a **Deployments** o **General**.
2. Activa el interruptor **Auto Deploy**.
3. Copia el **Webhook URL** proporcionado y agrégalo en tu repositorio de GitHub:
   - Ve a `Settings` > `Webhooks` > `Add webhook`.
   - **Payload URL:** Pega la URL de Dokploy.
   - **Content type:** `application/json`.
   - **Which events:** `Just the push event`.

---

## 🎬 Guion de la Demo en Vivo (Para impresionar a tu Audiencia)

1. **Prepara las 4 pestañas en tu pantalla:**
   - Pestaña 1: `tudominio.com/` (E-commerce).
   - Pestaña 2: `tudominio.com/app` (PWA con vista móvil en Chrome DevTools).
   - Pestaña 3: `tudominio.com/admin` (Panel de Control).
   - Pestaña 4: Dashboard de Dokploy mostrando los contenedores y logs.

2. **Demuestra la reactividad y sincronización:**
   - En el Panel Admin (`/admin`), crea un nuevo producto en vivo.
   - Pasa al E-commerce (`/`) o a la PWA (`/app`) y muestra cómo el producto ya aparece disponible instantáneamente.

3. **El momento cumbre: El "Live Push":**
   - Abre en tu editor el archivo `apps/ecommerce/src/pages/index.astro`.
   - Cambia el banner superior:
     ```html
     <div class="banner">🔥 50% DE DESCUENTO EN VIVO PARA LOS ASISTENTES</div>
     ```
   - En tu terminal ejecuta:
     ```bash
     git commit -am "feat: oferta especial en vivo para la audiencia"
     git push origin main
     ```
   - Cambia a la pestaña de Dokploy: la audiencia verá cómo Dokploy detecta el push, ejecuta las etapas multi-stage en paralelo (aprovechando la caché de Docker) y completa el despliegue en ~20 segundos.
   - Recarga el E-commerce y la PWA: el cambio estará en producción sin tiempo de caída (*Zero Downtime*).
