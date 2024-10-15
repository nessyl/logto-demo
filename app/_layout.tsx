import React from 'react';
import { Stack } from 'expo-router';
import { LogtoConfig, LogtoProvider, UserScope } from '@logto/rn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import config from '@/config/environment';

const queryClient = new QueryClient();

const logtoConfig: LogtoConfig = {
  appId: config.logtoAppId,
  endpoint: 'https://auth.nessyl.com/',
  resources: ['https://api.nessyl.com'],
  scopes: [
    UserScope.Email,
    UserScope.Phone,
    UserScope.Profile,
    UserScope.Organizations,
    'urn:logto:scope:organization_token',
  ]
};

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LogtoProvider config={logtoConfig}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="organization-select" options={{ headerShown: false }} />
        </Stack>
      </LogtoProvider>
    </QueryClientProvider>
  );
}
