import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../lib/auth';

function RootLayoutNav() {
  const { session, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for minimum 2 seconds and wait for auth to be ready
    const timer = setTimeout(() => {
      if (!authLoading) {
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [authLoading]);

  // Keep showing splash screen while auth is loading
  if (authLoading || isLoading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ gestureEnabled: false }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen
          name="login"
          options={{
            gestureEnabled: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="index"
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="tickets"
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="inventory"
            options={{
              gestureEnabled: false,
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
