import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AppHeader } from '../components/common/AppHeader';
import { useAuth } from '../context/AuthContext';
import { UserFormScreen } from '../screens/Admin/UserFormScreen';
import { UserListScreen } from '../screens/Admin/UserListScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import { PostDetailsScreen } from '../screens/Posts/PostDetailsScreen';
import { PostFormScreen } from '../screens/Posts/PostFormScreen';
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
    <AppStack.Navigator
        screenOptions={{
            header: AppHeader, 
        }}
    >
       
        <AppStack.Screen name="MainTabs" component={TabNavigator} /> 
        
      
        <AppStack.Screen 
            name="PostDetails" 
            component={PostDetailsScreen} 
            options={{ title: 'Detalhes do Comunicado' }} 
        />
        
        <AppStack.Screen 
            name="PostForm" 
            component={PostFormScreen} 
            options={({ route }) => ({ 
              // @ts-ignore
              title: route.params?.post ? 'Editar Comunicação' : 'Nova Comunicação',
              headerStyle: { backgroundColor: '#062E4B' },
              headerTintColor: '#fff',
              header: undefined, 
            })} 
        />

        <AppStack.Screen name="UserList" component={UserListScreen} options={({ route }) => ({
            // @ts-ignore
            title: `Gerenciar ${route.params?.type === 'professor' ? 'Professores' : 'Alunos'}`
        })} />

        <AppStack.Screen 
            name="UserForm" 
            component={UserFormScreen} 
            options={({ route }) => ({
                // @ts-ignore
                title: route.params?.user ? `Editar ${route.params?.user.role.toUpperCase()}` : `Novo ${route.params?.role.toUpperCase()}`,
                headerStyle: { backgroundColor: '#062E4B' },
                headerTintColor: '#fff',
                header: undefined,
            })} 
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