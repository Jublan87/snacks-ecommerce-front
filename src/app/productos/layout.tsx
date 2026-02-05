import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos',
  description:
    'Explora nuestra amplia selección de snacks. Filtra por categoría, busca tus productos favoritos y encuentra las mejores ofertas.',
  openGraph: {
    title: 'Productos - Snacks Ecommerce',
    description:
      'Explora nuestra amplia selección de snacks. Filtra por categoría, busca tus productos favoritos y encuentra las mejores ofertas.',
    url: '/productos',
  },
};

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
