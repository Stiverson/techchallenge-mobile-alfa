import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import { PostDetailsScreen } from '../screens/Posts/PostDetailsScreen';
import TabNavigator from './TabNavigator';


const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();


const LoadingView = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0E6DB1" />
      <Text style={{ marginTop: 10 }}>Carregando...</Text>
    </View>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  </AuthStack.Navigator>
);

const AppStackScreen = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} /> 
    <AppStack.Screen 
      name="PostDetails" 
      component={PostDetailsScreen} 
      options={{ title: 'Detalhes do Comunicado' }} 
    />
  </AppStack.Navigator>
);

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStackScreen /> : <AuthStackScreen />} 
    </NavigationContainer>
  );
}