'use client';

import { Tab, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { User, MapPin, Lock } from 'lucide-react';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { Card, CardContent } from '@/shared/ui/card';
import ProfileInfoTab from '@/features/auth/components/ProfileInfoTab';
import ProfileAddressTab from '@/features/auth/components/ProfileAddressTab';
import ProfilePasswordTab from '@/features/auth/components/ProfilePasswordTab';

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu información personal, direcciones y configuración de
          cuenta
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tab>
            <TabList className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tab
                    key={tab.id}
                    className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap data-[selected]:border-b-2 data-[selected]:border-[#FF5454] data-[selected]:text-[#FF5454] data-[selected]:bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </Tab>
                );
              })}
            </TabList>

            <TabPanels className="p-6">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabPanel key={tab.id}>
                    <Component />
                  </TabPanel>
                );
              })}
            </TabPanels>
          </Tab>
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
