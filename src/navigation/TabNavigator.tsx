import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { AdminHomeScreen } from '../screens/Admin/AdminHomeScreen';
import { PostsListScreen } from '../screens/Posts/PostsListScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E6DB1', // Cor principal do seu tema
      }}
    >
      <Tab.Screen 
        name="Comunicações" 
        component={PostsListScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Administração" 
        component={AdminHomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}