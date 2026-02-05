'use client';

import dynamic from 'next/dynamic';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { User, MapPin, Lock, Package } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import { Card, CardContent } from '@shared/ui/card';
import { Button } from '@shared/ui/button';

// Lazy load de los tabs del perfil para mejorar performance
const ProfileInfoTab = dynamic(
  () => import('@features/auth/components/ProfileInfoTab'),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

const ProfileAddressTab = dynamic(
  () => import('@features/auth/components/ProfileAddressTab'),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

const ProfilePasswordTab = dynamic(
  () => import('@features/auth/components/ProfilePasswordTab'),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

function ProfilePageContent() {
  const tabs = [
    {
      id: 'info',
      name: 'Información Personal',
      icon: User,
      component: ProfileInfoTab,
    },
    {
      id: 'address',
      name: 'Direcciones',
      icon: MapPin,
      component: ProfileAddressTab,
    },
    {
      id: 'password',
      name: 'Cambiar Contraseña',
      icon: Lock,
      component: ProfilePasswordTab,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <Link href="/perfil/pedidos">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Mis Pedidos</span>
              <span className="sm:hidden">Ver Pedidos</span>
            </Button>
          </Link>
        </div>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Gestiona tu información personal, direcciones y configuración de
          cuenta
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <TabGroup>
            <TabList className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tab
                    key={tab.id}
                    className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm font-medium transition-colors whitespace-nowrap data-[selected]:border-b-2 data-[selected]:border-brand data-[selected]:text-brand data-[selected]:bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  </Tab>
                );
              })}
            </TabList>

            <TabPanels className="p-4 md:p-6">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabPanel key={tab.id}>
                    <Component />
                  </TabPanel>
                );
              })}
            </TabPanels>
          </TabGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
