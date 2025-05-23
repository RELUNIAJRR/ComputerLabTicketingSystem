import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1e40af',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          },
          headerStyle: {
            backgroundColor: '#1e40af',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="dashboard" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: 'Inventory',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="desktop" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="ticket" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
} 