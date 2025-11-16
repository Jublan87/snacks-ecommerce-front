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
├── components/              # Componentes de layout compartidos
│   └── layout/
│       ├── Header.tsx       # Header de la aplicación
│       ├── Footer.tsx       # Footer de la aplicación
│       └── CartDrawer.tsx   # Drawer del carrito lateral
│
├── features/                # Features del dominio (organización por feature)
│   │
│   ├── cart/                # Feature: Carrito de compras
│   │   ├── components/      # Componentes específicos del carrito
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartEmptyState.tsx
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

Componentes de layout que no pertenecen a una feature específica:

- Header, Footer, CartDrawer, etc.

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
- ✅ `shared/ui/` para componentes UI base
- ✅ `shared/utils/` para utilidades
- ✅ `shared/contexts/` para contextos globales

## Ejemplos de Imports

```typescript
// ✅ Correcto: Importar desde shared
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/utils';

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
