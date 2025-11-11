import { Product, Category } from '@/types/product';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Snacks Salados',
    slug: 'snacks-salados',
    description: 'Papas fritas, nachos y más',
    order: 1,
    isActive: true,
    children: [
      {
        id: 'cat-1-1',
        name: 'Papas Fritas',
        slug: 'papas-fritas',
        parentId: 'cat-1',
        order: 1,
        isActive: true,
      },
      {
        id: 'cat-1-2',
        name: 'Nachos',
        slug: 'nachos',
        parentId: 'cat-1',
        order: 2,
        isActive: true,
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Golosinas',
    slug: 'golosinas',
    description: 'Chocolates, caramelos y más',
    order: 2,
    isActive: true,
    children: [
      {
        id: 'cat-2-1',
        name: 'Chocolates',
        slug: 'chocolates',
        parentId: 'cat-2',
        order: 1,
        isActive: true,
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Gaseosas, aguas y más',
    order: 3,
    isActive: true,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Doritos Nacho Cheese 150g',
    slug: 'doritos-nacho-cheese-150g',
    description:
      'Los clásicos Doritos sabor queso nacho. Triángulos de maíz horneados con un sabor intenso y auténtico. Perfectos para compartir o disfrutar solo.',
    shortDescription: 'Sabor intenso a queso nacho',
    sku: 'DOR-NAC-150',
    price: 1250.0,
    discountPrice: 999.0,
    discountPercentage: 20,
    stock: 45,
    images: [
      {
        id: 'img-1',
        url: 'https://placehold.co/600x600/FF6B35/FFFFFF/png?text=Doritos',
        alt: 'Doritos Nacho Cheese 150g vista frontal',
        isPrimary: true,
        order: 1,
      },
      {
        id: 'img-2',
        url: 'https://placehold.co/600x600/FF6B35/FFFFFF/png?text=Doritos+Back',
        alt: 'Doritos Nacho Cheese 150g vista trasera',
        isPrimary: false,
        order: 2,
      },
    ],
    categoryId: 'cat-1-2',
    category: {
      id: 'cat-1-2',
      name: 'Nachos',
      slug: 'nachos',
      parentId: 'cat-1',
      order: 2,
      isActive: true,
    },
    isActive: true,
    isFeatured: true,
    tags: ['oferta', 'popular', 'vegano'],
    weight: 150,
    dimensions: {
      width: 18,
      height: 25,
      depth: 5,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
  {
    id: 'prod-2',
    name: 'Lays Classic 180g',
    slug: 'lays-classic-180g',
    description:
      'Las papas fritas Lays Classic. Cortadas finas y fritas a la perfección con sal. Sabor tradicional que todos aman.',
    shortDescription: 'El sabor clásico de siempre',
    sku: 'LAY-CLA-180',
    price: 1150.0,
    stock: 60,
    images: [
      {
        id: 'img-3',
        url: 'https://placehold.co/600x600/FFD93D/000000/png?text=Lays',
        alt: 'Lays Classic 180g',
        isPrimary: true,
        order: 1,
      },
    ],
    categoryId: 'cat-1-1',
    category: {
      id: 'cat-1-1',
      name: 'Papas Fritas',
      slug: 'papas-fritas',
      parentId: 'cat-1',
      order: 1,
      isActive: true,
    },
    isActive: true,
    isFeatured: true,
    tags: ['popular', 'clasico'],
    weight: 180,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
  {
    id: 'prod-3',
    name: 'Oreo Original 118g',
    slug: 'oreo-original-118g',
    description:
      'Las famosas galletas Oreo. Dos galletas de chocolate con un delicioso relleno de crema. Un clásico que nunca pasa de moda.',
    shortDescription: 'Galletas con relleno de crema',
    sku: 'ORE-ORI-118',
    price: 850.0,
    discountPrice: 680.0,
    discountPercentage: 20,
    stock: 0,
    images: [
      {
        id: 'img-4',
        url: 'https://placehold.co/600x600/003366/FFFFFF/png?text=Oreo',
        alt: 'Oreo Original 118g',
        isPrimary: true,
        order: 1,
      },
    ],
    categoryId: 'cat-2',
    category: {
      id: 'cat-2',
      name: 'Golosinas',
      slug: 'golosinas',
      order: 2,
      isActive: true,
    },
    isActive: true,
    isFeatured: false,
    tags: ['oferta', 'sin-stock'],
    weight: 118,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
  {
    id: 'prod-4',
    name: 'Coca Cola 500ml',
    slug: 'coca-cola-500ml',
    description:
      'Coca-Cola refrescante en botella de 500ml. El sabor original que refresca tu día.',
    shortDescription: 'Refresco sabor original',
    sku: 'COC-COL-500',
    price: 650.0,
    stock: 120,
    images: [
      {
        id: 'img-5',
        url: 'https://placehold.co/600x600/E61610/FFFFFF/png?text=Coca-Cola',
        alt: 'Coca Cola 500ml',
        isPrimary: true,
        order: 1,
      },
    ],
    categoryId: 'cat-3',
    category: {
      id: 'cat-3',
      name: 'Bebidas',
      slug: 'bebidas',
      order: 3,
      isActive: true,
    },
    isActive: true,
    isFeatured: true,
    tags: ['bebida', 'popular'],
    weight: 500,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
  {
    id: 'prod-5',
    name: 'Pringles Original 124g',
    slug: 'pringles-original-124g',
    description:
      'Pringles sabor original en su icónico tubo. Papas perfectamente apiladas con un sabor único.',
    shortDescription: 'Papas en tubo sabor original',
    sku: 'PRI-ORI-124',
    price: 1450.0,
    stock: 35,
    images: [
      {
        id: 'img-6',
        url: 'https://placehold.co/600x600/C50022/FFFFFF/png?text=Pringles',
        alt: 'Pringles Original 124g',
        isPrimary: true,
        order: 1,
      },
    ],
    categoryId: 'cat-1-1',
    isActive: true,
    isFeatured: false,
    tags: ['premium'],
    weight: 124,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
];

// Helper functions para trabajar con los mocks
export const getMockProductBySlug = (slug: string): Product | undefined => {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
};

export const getMockProductsByCategory = (categoryId: string): Product[] => {
  return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
};

export const getMockFeaturedProducts = (): Product[] => {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
};

export const getMockProductsInStock = (): Product[] => {
  return MOCK_PRODUCTS.filter((p) => p.stock > 0);
};

