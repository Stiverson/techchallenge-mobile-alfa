import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, 
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}