# Arquitectura del Proyecto

Este documento describe la estructura de carpetas y organización del código del proyecto.

## Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout principal de la aplicación
│   ├── page.tsx             # Página de inicio
│   ├── globals.css          # Estilos globales
│   ├── carrito/
│   │   └── page.tsx         # Página del carrito de compras
│   └── productos/
│       ├── page.tsx         # Página de listado de productos
│       └── [slug]/
│           └── page.tsx     # Página de detalle de producto
│
├── features/                # Features del dominio (organización por feature)
│   │
│   ├── cart/                # Feature: Carrito de compras
│   │   ├── components/      # Componentes específicos del carrito
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartEmptyState.tsx
│   │   │   └── CartDrawer.tsx   # Drawer del carrito lateral
│   │   ├── hooks/           # Hooks específicos del carrito
│   │   │   ├── useAddToCart.ts
│   │   │   ├── useCartActions.ts
│   │   │   └── useCartCalculations.ts
│   │   ├── store/           # Estado global del carrito (Zustand)
│   │   │   └── cart-store.ts
│   │   └── types.ts         # Tipos TypeScript del carrito
│   │
│   ├── product/             # Feature: Productos
│   │   ├── components/      # Componentes específicos de productos
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── ProductQuantitySection.tsx
│   │   │   ├── ProductBreadcrumbs.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadingState.tsx
│   │   ├── hooks/           # Hooks específicos de productos
│   │   ├── services/        # Servicios/lógica de negocio de productos
│   │   ├── mocks/           # Datos mock de productos
│   │   │   └── products.mock.ts
│   │   └── types.ts         # Tipos TypeScript de productos
│   │
│   ├── filters/             # Feature: Filtros y búsqueda
│   │   ├── components/      # Componentes de filtros
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── DiscountFilter.tsx
│   │   │   ├── ProductSearch.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   └── ProductPagination.tsx
│   │   ├── services/        # Servicios de filtrado
│   │   └── types.ts         # Tipos TypeScript de filtros
│   │
│   └── shipping/            # Feature: Envío
│       ├── services/      # Servicios de cálculo de envío
│       │   └── shipping.service.ts
│       └── types.ts         # Tipos TypeScript de envío
│
└── shared/                  # Código compartido entre features
    ├── components/          # Componentes compartidos de layout
    │   └── layout/
    │       ├── Header.tsx   # Header de la aplicación
    │       └── Footer.tsx   # Footer de la aplicación
    ├── ui/                  # Componentes UI base (Shadcn)
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── card.tsx
    │   ├── dialog.tsx
    │   ├── badge.tsx
    │   ├── select.tsx
    │   ├── separator.tsx
    │   └── dropdown-menu.tsx
    ├── hooks/               # Hooks genéricos reutilizables
    ├── utils/               # Utilidades puras
    │   ├── utils.ts         # Utilidades generales (cn, etc.)
    │   └── productFilters.ts # Funciones de filtrado de productos
    ├── contexts/            # Contextos globales de React
    │   └── SearchContext.tsx
    ├── middleware/          # Middlewares de Next.js
    │   ├── auth.middleware.ts  # Middleware de autenticación
    │   └── utils.ts         # Utilidades para middlewares
    └── types/               # Tipos TypeScript realmente compartidos
```

## Principios de Organización

### 1. Features (Dominio)

Cada feature agrupa todo el código relacionado con un dominio específico:

- **components/**: Componentes específicos de la feature
- **hooks/**: Hooks personalizados de la feature
- **store/**: Estado global específico (Zustand, Redux, etc.)
- **services/**: Lógica de negocio y llamadas a APIs
- **mocks/**: Datos mock para desarrollo y testing
- **types.ts**: Tipos TypeScript específicos de la feature

### 2. Shared (Compartido)

Código que es utilizado por múltiples features:

- **components/**: Componentes compartidos de layout (Header, Footer, etc.)
- **ui/**: Componentes UI base (Shadcn/ui)
- **hooks/**: Hooks genéricos reutilizables
- **utils/**: Funciones utilitarias puras
- **contexts/**: Contextos de React compartidos
- **types/**: Tipos TypeScript compartidos entre features

### 3. App Router (Next.js)

Páginas y layouts de Next.js App Router:

- Cada ruta corresponde a una carpeta
- `layout.tsx` para layouts compartidos
- `page.tsx` para páginas

### 4. Components (Layout)

Componentes de layout globales que no pertenecen a una feature específica:

- **Header, Footer**: Ubicados en `shared/components/layout/` porque son componentes de layout globales usados en toda la aplicación
- **CartDrawer**: Ubicado en `features/cart/components/` porque está fuertemente acoplado a la feature del carrito y usa múltiples hooks y componentes específicos del carrito

## Reglas de Importación

### Imports entre Features

- ❌ **NO** importar directamente entre features
- ✅ Usar `shared/` para código compartido
- ✅ Si dos features necesitan compartir código, moverlo a `shared/`

### Imports dentro de una Feature

- ✅ Componentes pueden importar hooks, services, types de su propia feature
- ✅ Mantener la estructura interna de la feature

### Imports desde Shared

- ✅ Cualquier feature puede importar desde `shared/`
- ✅ `shared/components/` para componentes de layout compartidos
- ✅ `shared/ui/` para componentes UI base
- ✅ `shared/utils/` para utilidades
- ✅ `shared/contexts/` para contextos globales

## Ejemplos de Imports

```typescript
// ✅ Correcto: Importar desde shared
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/utils';
import Header from '@/shared/components/layout/Header';

// ✅ Correcto: Importar dentro de la misma feature
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import type { Product } from '@/features/product/types';

// ✅ Correcto: Importar desde otra feature (solo tipos)
import type { Product } from '@/features/product/types';

// ❌ Incorrecto: Importar componente de otra feature directamente
import { ProductCard } from '@/features/product/components/ProductCard';
// En su lugar, exponerlo a través de shared o crear un wrapper
```

## Convenciones de Nombres

- **Componentes**: PascalCase (ej: `ProductCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useAddToCart.ts`)
- **Services**: camelCase con sufijo `.service.ts` (ej: `shipping.service.ts`)
- **Types**: camelCase con sufijo `.types.ts` o `types.ts` (ej: `types.ts`)
- **Utils**: camelCase (ej: `productFilters.ts`)
- **Mocks**: camelCase con sufijo `.mock.ts` (ej: `products.mock.ts`)

## Reglas de Arquitectura y Desarrollo

> **Nota importante**: Algunas de estas reglas aún no se implementan porque el proyecto está en fase inicial sin backend. Sin embargo, deben tenerse en cuenta y aplicarse cuando corresponda. Las reglas están marcadas con su estado actual: ✅ Implementado, ⏳ Pendiente (cuando haya backend), 🔄 Aplicar cuando corresponda.

### 1. Principios Base

#### ✅ Usar RSC como default

- **Server Components** son el default en Next.js 15
- Solo usar `'use client'` cuando el componente necesite:
  - Hooks de React (`useState`, `useEffect`, etc.)
  - Eventos del navegador (`onClick`, `onChange`, etc.)
  - APIs del navegador (`localStorage`, `window`, etc.)
  - Context API (aunque el Provider puede ser RSC)

#### ✅ Client Components solo para interactividad

- Minimizar el uso de Client Components
- Extraer lógica interactiva a hooks personalizados
- Mantener la mayoría de componentes como RSC

#### ✅ Estructura por features

- Organizar código por dominio de negocio: `cart/`, `product/`, `shipping/`, `filters/`
- Cada feature agrupa: `components/`, `hooks/`, `services/`, `store/`, `types.ts`
- Evitar features genéricas o demasiado amplias

### 2. Servicios sin Sobredimensionar

#### ⏳ Data fetching va en `features/[feature]/services/*.service.ts`

- **Estado actual**: Las carpetas `services/` existen pero están vacías (usando mocks)
- **Cuando implementar**: Al conectar el backend, crear servicios para:
  - `features/product/services/product.service.ts` - Obtener productos, detalles, etc.
  - `features/filters/services/filter.service.ts` - Búsqueda, filtros, etc.
- **Ejemplo futuro**:

```typescript
// features/product/services/product.service.ts
export async function getProducts(filters?: ProductFilters) {
  const res = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(filters),
  });
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}
```

#### ⏳ Los componentes importan services, nunca hacen fetch directo

- **Estado actual**: Los componentes usan mocks directamente
- **Cuando implementar**: Al conectar el backend, los componentes deben:
  - Importar funciones de `services/`
  - Nunca usar `fetch()` directamente en componentes
  - Los services encapsulan toda la lógica de API

#### ⏳ Services pueden usar fetch directo (sin adaptadores)

- Los services pueden usar `fetch()` nativo de JavaScript
- No es necesario crear adaptadores para `fetch` básico
- Solo crear adaptadores para SDKs complejos (ver regla 3)

#### ⏳ Solo crear adaptadores para SDKs complejos

- Crear adaptadores solo cuando uses SDKs que puedan cambiar de proveedor:
  - Stripe SDK
  - MercadoPago SDK
  - Auth0/Clerk
  - Cualquier SDK que pueda cambiar de proveedor
- **Ejemplo futuro**:

```typescript
// features/payment/adapters/stripe.adapter.ts
export class StripeAdapter {
  // Encapsula toda la lógica de Stripe
  // Si cambias a otro proveedor, solo cambias este archivo
}
```

### 3. Librerías de Uso Directo

#### ✅ Librerías permitidas sin adaptador

Estas librerías se usan directamente sin necesidad de adaptadores:

- **Tailwind CSS** - Framework de estilos
- **Shadcn/ui, Radix UI** - Componentes UI base
- **Lucide React** - Iconos
- **Zod** - Validación de esquemas (cuando se implemente)
- **React Hook Form** - Manejo de formularios (cuando se implemente)
- **date-fns** - Formateo de fechas en UI (cuando se implemente)
- **Lodash, clsx, uuid** - Utilidades generales

### 4. date-fns Pragmático

#### ⏳ Formateo en UI: uso directo

- **Cuando implementar**: Al necesitar formatear fechas en componentes
- Usar `date-fns` directamente en componentes para formateo simple
- **Ejemplo futuro**:

```typescript
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ProductDate({ date }: { date: Date }) {
  return <span>{format(date, 'dd/MM/yyyy', { locale: es })}</span>;
}
```

#### ⏳ Lógica de negocio: encapsular en utils

- Si necesitas lógica compleja de fechas (cálculos, validaciones), crear funciones en `shared/utils/`
- **Ejemplo futuro**:

```typescript
// shared/utils/dateUtils.ts
import { differenceInDays, isAfter } from 'date-fns';

export function isProductNew(createdAt: Date): boolean {
  const daysSinceCreation = differenceInDays(new Date(), createdAt);
  return daysSinceCreation <= 30;
}
```

### 5. Validación con Zod

#### ⏳ Agregar cuando conectes el backend

- **Estado actual**: No implementado (no hay backend)
- **Cuando implementar**: Al conectar el backend, usar Zod para:

#### ⏳ Validar respuestas de API en services

- Validar todas las respuestas de API con esquemas Zod
- **Ejemplo futuro**:

```typescript
// features/product/services/product.service.ts
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  // ...
});

export async function getProduct(id: string) {
  const res = await fetch(`/api/products/${id}`);
  const data = await res.json();
  return ProductSchema.parse(data); // Valida y lanza error si no coincide
}
```

#### ⏳ Formularios complejos (checkout, perfil)

- Usar Zod con React Hook Form para validación de formularios
- **Ejemplo futuro**:

```typescript
// features/checkout/schemas/checkout.schema.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email(),
  address: z.string().min(10),
  // ...
});
```

### 6. Estado

#### ✅ Local: useState/useReducer

- Estado simple y local → `useState`
- Estado complejo local → `useReducer`
- No usar estado global para datos que solo un componente necesita

#### ✅ Compartido: Context API

- Estado compartido entre componentes relacionados → Context API
- **Ejemplo actual**: `SearchContext` para búsqueda global

#### ⏳ Servidor: RSC + Server Actions

- **Estado actual**: Usando RSC, pero sin Server Actions aún
- **Cuando implementar**: Al conectar el backend, usar Server Actions para:
  - Mutaciones de datos (crear, actualizar, eliminar)
  - Formularios que requieren acción del servidor
- **Ejemplo futuro**:

```typescript
// app/actions/product.actions.ts
'use server';

export async function addToCart(productId: string, quantity: number) {
  // Lógica del servidor
}
```

#### ✅ Global cliente: Zustand

- Estado global del cliente → Zustand
- **Ejemplo actual**: `cart-store.ts` para el carrito de compras
- Usar persistencia cuando sea necesario (localStorage, sessionStorage)

### 7. Rutas App Router

#### ✅ page.tsx

- Todas las rutas tienen `page.tsx`
- Usar RSC cuando sea posible

#### ⏳ loading.tsx

- **Estado actual**: No implementado
- **Cuando implementar**: Crear `loading.tsx` en rutas que carguen datos
- **Ejemplo futuro**:

```typescript
// app/productos/loading.tsx
import LoadingState from '@/features/product/components/LoadingState';

export default function Loading() {
  return <LoadingState />;
}
```

#### ⏳ error.tsx

- **Estado actual**: No implementado
- **Cuando implementar**: Crear `error.tsx` en rutas que puedan fallar
- **Ejemplo futuro**:

```typescript
// app/productos/error.tsx
'use client';

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
```

#### 🔄 not-found.tsx (opcional)

- Crear `not-found.tsx` cuando necesites páginas 404 personalizadas
- Por ahora, Next.js maneja esto automáticamente

### 8. Performance

#### ✅ next/image

- Siempre usar `next/image` en lugar de `<img>`
- Configurar `sizes` apropiadamente
- Usar `priority` para imágenes above-the-fold

#### ✅ Minimizar Client Components

- Mantener la mayoría de componentes como RSC
- Solo usar Client Components cuando sea necesario

#### ✅ generateStaticParams

- Usar `generateStaticParams` para rutas dinámicas cuando sea posible
- **Ejemplo actual**: Implementado en `app/productos/[slug]/page.tsx`

#### ✅ Metadata

- Usar `generateMetadata` para SEO dinámico
- **Ejemplo actual**: Implementado en `app/productos/[slug]/page.tsx`

### 9. Accesibilidad

#### ✅ Alt en imágenes

- Todas las imágenes deben tener `alt` descriptivo
- Si es decorativa, usar `alt=""`

#### ✅ aria-label en botones

- Botones sin texto visible deben tener `aria-label`
- Botones con iconos deben ser descriptivos

#### ✅ Componentes Radix/Shadcn

- Estos componentes ya son accesibles por defecto
- No modificar su comportamiento de accesibilidad

#### ✅ Navegación con teclado

- Asegurar que todos los elementos interactivos sean navegables con teclado
- Usar `tabIndex` apropiadamente
- Manejar eventos `onKeyDown` cuando sea necesario

### 10. Ecommerce

#### ✅ Optimistic UI en carrito

- Actualizar UI inmediatamente antes de confirmar con el servidor
- **Ejemplo actual**: Implementado en `cart-store.ts`

#### ✅ Validación de stock

- Validar stock antes de agregar al carrito
- Mostrar mensajes claros cuando no hay stock
- **Ejemplo actual**: Implementado en `cart-store.ts`

#### ✅ localStorage + sync

- Persistir carrito en localStorage
- Sincronizar con servidor cuando esté disponible
- **Ejemplo actual**: Implementado con Zustand persist

#### ✅ SEO metadata

- Metadata dinámica para productos
- Open Graph y Twitter Cards
- **Ejemplo actual**: Implementado en `app/productos/[slug]/page.tsx`

#### ✅ Lazy loading

- Usar `next/image` con lazy loading
- Lazy load de componentes pesados con `next/dynamic`
- Cargar datos bajo demanda

## Reglas de Desarrollo

### 1. Principio DRY (Don't Repeat Yourself)

- ❌ **NO** duplicar código
- ✅ Extraer lógica común a funciones utilitarias en `shared/utils/`
- ✅ Crear componentes reutilizables en lugar de copiar código
- ✅ Si encuentras código duplicado 3 veces, es momento de refactorizar

**Ejemplo:**

```typescript
// ❌ Incorrecto: Duplicación
const formatPrice1 = (price: number) => `$${price.toLocaleString('es-AR')}`;
const formatPrice2 = (price: number) => `$${price.toLocaleString('es-AR')}`;

// ✅ Correcto: Función reutilizable
// shared/utils/formatters.ts
export const formatPrice = (price: number) =>
  `$${price.toLocaleString('es-AR')}`;
```

### 2. Componentes Reutilizables y Pequeños

- ✅ **Mantener componentes pequeños** (máximo 200-300 líneas)
- ✅ **Un componente = una responsabilidad**
- ✅ Extraer sub-componentes cuando un componente crece demasiado
- ✅ Crear componentes genéricos en `shared/ui/` si se usan en múltiples features
- ✅ Componentes específicos de una feature van en `features/[feature]/components/`

**Ejemplo:**

```typescript
// ❌ Incorrecto: Componente muy grande con múltiples responsabilidades
function ProductCard() {
  // 500 líneas de código mezclando lógica de UI, estado, y negocio
}

// ✅ Correcto: Componente pequeño y enfocado
function ProductCard({ product }: ProductCardProps) {
  // Solo renderizado, lógica extraída a hooks
  const { handleAddToCart } = useAddToCart(product);
  return (/* JSX simple */);
}
```

### 3. Separación de Responsabilidades

- ✅ **Lógica de negocio** → `services/` o `hooks/`
- ✅ **Lógica de UI** → Componentes
- ✅ **Estado global** → `store/` (Zustand)
- ✅ **Estado local simple** → `useState` dentro del componente
- ✅ **Utilidades puras** → `shared/utils/`

**Ejemplo:**

```typescript
// ❌ Incorrecto: Lógica de negocio en el componente
function ProductCard({ product }: ProductCardProps) {
  const [cart, setCart] = useState([]);
  const addToCart = () => {
    // 50 líneas de lógica de negocio aquí
  };
}

// ✅ Correcto: Lógica extraída a hook
function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useAddToCart(product);
  // Componente solo se encarga del renderizado
}
```

### 4. Composición sobre Herencia

- ✅ Preferir composición de componentes pequeños
- ✅ Usar props para personalizar comportamiento
- ✅ Crear variantes con props en lugar de duplicar componentes

**Ejemplo:**

```typescript
// ✅ Correcto: Componente base reutilizable
function Button({ variant, size, children, ...props }: ButtonProps) {
  return <button className={cn(variant, size)} {...props}>{children}</button>;
}

// Uso con diferentes variantes
<Button variant="primary">Agregar</Button>
<Button variant="secondary">Cancelar</Button>
```

### 5. TypeScript y Tipado

- ✅ **Siempre tipar props, funciones y valores de retorno**
- ✅ Usar `type` para uniones y `interface` para objetos extensibles
- ✅ Evitar `any`, usar `unknown` si es necesario
- ✅ Crear tipos compartidos en `types.ts` de cada feature

**Ejemplo:**

```typescript
// ✅ Correcto: Tipado explícito
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

### 6. Performance y Optimización

- ✅ Usar `useMemo` para cálculos costosos
- ✅ Usar `useCallback` para funciones pasadas como props
- ✅ Implementar `React.memo` para componentes que se re-renderizan frecuentemente
- ✅ Lazy loading de componentes pesados con `next/dynamic`

**Ejemplo:**

```typescript
// ✅ Correcto: Memoización de cálculos costosos
const expensiveValue = useMemo(() => {
  return products.reduce((acc, p) => acc + p.price, 0);
}, [products]);
```

### 7. Manejo de Errores

- ✅ Usar estados de error en lugar de `try-catch` en componentes
- ✅ Crear componentes de error reutilizables (`ErrorBoundary`, `ErrorState`)
- ✅ Validar datos en los servicios antes de procesarlos

### 8. Accesibilidad

- ✅ Usar etiquetas semánticas HTML (`<button>`, `<nav>`, `<main>`, etc.)
- ✅ Agregar `aria-label` cuando sea necesario
- ✅ Mantener contraste de colores adecuado
- ✅ Asegurar navegación por teclado

### 9. Estilos y CSS

- ✅ Usar Tailwind CSS para estilos
- ✅ Crear clases utilitarias reutilizables en `globals.css` si es necesario
- ✅ Evitar estilos inline, preferir clases de Tailwind
- ✅ Mantener consistencia en espaciado, colores y tipografía

### 10. Testing y Calidad de Código

- ✅ Escribir código testeable (funciones puras, componentes pequeños)
- ✅ Mantener funciones puras cuando sea posible
- ✅ Documentar funciones complejas con comentarios
- ✅ Usar nombres descriptivos para variables y funciones

### 11. Git y Commits

- ✅ Hacer commits pequeños y frecuentes
- ✅ Mensajes de commit descriptivos
- ✅ Revisar cambios antes de hacer commit

### Checklist Antes de Crear un Componente Nuevo

Antes de crear un nuevo componente, pregúntate:

- [ ] ¿Ya existe un componente similar que pueda reutilizar?
- [ ] ¿Este componente será usado en múltiples lugares?
- [ ] ¿Puedo extraer parte de la lógica a un hook o servicio?
- [ ] ¿El componente tiene una sola responsabilidad?
- [ ] ¿Está en la ubicación correcta según la arquitectura?

## Mantenimiento

Esta arquitectura debe mantenerse consistente. Al agregar nuevas features:

1. Crear la carpeta en `src/features/[nombre-feature]/`
2. Organizar siguiendo la estructura: `components/`, `hooks/`, `services/`, `types.ts`
3. Si el código será compartido, colocarlo en `shared/`
4. Actualizar este documento si se agregan nuevas convenciones
