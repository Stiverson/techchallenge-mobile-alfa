import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UserFormScreen } from '../screens/Admin/UserFormScreen';
import { UserListScreen } from '../screens/Admin/UserListScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import { PostDetailsScreen } from '../screens/Posts/PostDetailsScreen';
import { PostFormScreen } from '../screens/Posts/PostFormScreen';
import TabNavigator from './TabNavigator';
// 💡 Importa o AppHeader para usá-lo como cabeçalho padrão
import { AppHeader } from '../components/common/AppHeader';


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
            // 💡 CORREÇÃO 1: Define o AppHeader como o cabeçalho padrão para toda a Stack
            header: AppHeader, 
        }}
    >
        {/* 💡 CORREÇÃO 2: Remove headerShown: false para que o AppHeader seja exibido */}
        <AppStack.Screen name="MainTabs" component={TabNavigator} /> 
        
        {/* Rotas de Posts */}
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
              header: undefined, // 💡 Usa o header nativo para o formulário (melhor experiência)
            })} 
        />

        {/* Rotas de Usuários */}
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
                header: undefined, // 💡 Usa o header nativo para o formulário de usuário
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