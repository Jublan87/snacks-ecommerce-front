# 🛒 Snacks Ecommerce Frontend

Frontend para un ecommerce de distribución de snacks, desarrollado con Next.js 15, React 19 y TypeScript.

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utility-first

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Envío
# Monto mínimo del subtotal para obtener envío gratis (en pesos)
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=10000

# Costo del envío cuando no aplica envío gratis (en pesos)
NEXT_PUBLIC_SHIPPING_COST=1500
```

**Nota:** Si no defines estas variables, se usarán los valores por defecto indicados arriba.

**Futuro:** Estos valores se obtendrán desde el backend mediante un endpoint que calculará el envío basado en la ubicación del usuario.

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📁 Estructura del Proyecto

```
snacks-ecommerce-front/
├── src/
│   └── app/          # App Router de Next.js
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/           # Archivos estáticos
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎯 Estado del Proyecto

Actualmente en desarrollo. Ver `PLANIFICACION.md` para el roadmap completo.

## 🏗️ Principios de Arquitectura

Este proyecto sigue el principio **DRY (Don't Repeat Yourself)**: nunca duplicar código similar en distintos componentes. Siempre extraer lógica y UI reutilizable en hooks y componentes compartidos.

Ver `ARQUITECTURA.md` para los principios detallados de construcción y refactorización.
