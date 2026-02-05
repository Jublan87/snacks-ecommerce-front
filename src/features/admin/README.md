# Panel de Administración

## Acceso al Panel

El panel de administración está disponible en `/admin` y requiere:

1. Estar autenticado
2. Tener rol de administrador

## Usuario Administrador por Defecto

Se crea automáticamente un usuario administrador con las siguientes credenciales:

- **Email:** `admin@snacks.com`
- **Contraseña:** `Admin-123`

Este usuario se inicializa automáticamente la primera vez que se accede al panel de administración.

## Estructura

```
src/features/admin/
├── components/
│   ├── AdminDashboard.tsx      # Dashboard principal con métricas
│   ├── AdminHeader.tsx          # Header del panel
│   ├── AdminLayoutClient.tsx    # Layout cliente del panel
│   ├── AdminSidebar.tsx         # Sidebar de navegación
│   └── ProtectedAdminRoute.tsx  # Componente para proteger rutas admin
└── utils/
    └── init-admin.ts            # Utilidad para inicializar usuario admin
```

## Rutas Disponibles

- `/admin` - Dashboard principal
- `/admin/productos` - Gestión de productos (hito 6.2)
- `/admin/pedidos` - Gestión de pedidos (hito 6.3)
- `/admin/stock` - Control de stock (hito 6.4)

## Protección de Rutas

Las rutas de administración están protegidas por:

1. **Middleware** (`src/shared/middleware/admin.middleware.ts`): Verifica autenticación básica
2. **ProtectedAdminRoute**: Componente cliente que verifica rol de admin

## Notas

- El sistema de roles es básico y usa localStorage (mock)
- En producción, el rol debería venir del token JWT decodificado
- El middleware actual verifica cookies, pero la verificación real se hace en el cliente
