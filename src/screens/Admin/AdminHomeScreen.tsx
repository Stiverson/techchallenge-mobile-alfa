import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

type AdminStackParamList = {
    UserList: { type: 'professor' | 'aluno' };
    [key: string]: object | undefined;
};

export function AdminHomeScreen() {
    const { user, logout } = useAuth();
   
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>(); 
    
    const isProfessor = user?.role === 'professor';

    const handleLogout = async () => {
        await logout(); 
    };
    
  
    const handleNavigateToList = (type: 'professor' | 'aluno') => {
        
        navigation.navigate('UserList', { type }); 
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Painel Administrativo</Text>
                <Text style={styles.roleText}>Perfil: {user?.role.toUpperCase()}</Text>
            </View>
            
          
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="exit-outline" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Fazer Logout</Text>
            </TouchableOpacity>


         
            {!isProfessor && (
                <View style={styles.messageBox}>
                    <Ionicons name="lock-closed" size={24} color="#0E6DB1" />
                    <Text style={styles.messageText}>Esta área é restrita a professores para gestão de usuários.</Text>
                </View>
            )}

            {isProfessor && (
                <View style={styles.adminOptions}>
                   
                    <Text style={styles.sectionTitle}>Opções de Gestão de Usuários</Text> 
                    
                   
                    <TouchableOpacity 
                        style={styles.optionButton}
                        onPress={() => handleNavigateToList('professor')} 
                    >
                        <Text style={styles.optionText}>Gerenciar Professores</Text>
                        <Ionicons name="chevron-forward" size={20} color="#0E6DB1" />
                    </TouchableOpacity>

                   
                    <TouchableOpacity 
                        style={styles.optionButton}
                        onPress={() => handleNavigateToList('aluno')} 
                    >
                        <Text style={styles.optionText}>Gerenciar Alunos</Text>
                        <Ionicons name="chevron-forward" size={20} color="#0E6DB1" />
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#062E4B',
    },
    roleText: {
        fontSize: 16,
        color: '#0E6DB1',
        marginTop: 5,
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15, 
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F', 
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    adminOptions: {
        marginTop: 20,
        gap: 15,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#062E4B',
    },
    messageBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 50,
        borderLeftWidth: 5,
        borderLeftColor: '#0E6DB1',
    },
    messageText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});