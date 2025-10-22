import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type NavigationProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiDeleteUser, apiFetchUsers } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

type Role = 'professor' | 'aluno';
type UserListItem = { id: string; email: string; role: Role }; 



const UserItem = ({ item, handleDelete }: { item: UserListItem, handleDelete: (item: UserListItem) => void }) => {
  
    const navigation = useNavigation<NavigationProp<any>>(); 

    const handleEdit = () => {
        
        (navigation.navigate as any)('UserForm', { user: item, role: item.role });
    };

    return (
        <View style={styles.userItem}>
            <Text style={styles.userEmail}>{item.email} ({item.role})</Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleEdit}>
                    <Ionicons name="create-outline" size={24} color="#0E6DB1" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


export function UserListScreen() {

    const navigation = useNavigation<NavigationProp<any>>(); 
    const route = useRoute(); 
    const queryClient = useQueryClient();
   
    const { user, token } = useAuth();
    
    // @ts-ignore
    const { type } = route.params as { type: Role }; 
    
    const queryKey = ['users', type];

    
    const { data: users, isLoading, isError } = useQuery({
        queryKey: queryKey,
        queryFn: () => apiFetchUsers(type, token!),
        enabled: !!token && user?.role === 'professor',
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiDeleteUser(type, id, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
            Alert.alert("Sucesso", `${type} removido com sucesso.`);
        },
        onError: (e) => {
            Alert.alert("Erro", `Não foi possível remover: ${e.message}`);
        }
    });

    const handleDeleteConfirm = (userToDelete: UserListItem) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Deseja excluir ${userToDelete.email}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => deleteMutation.mutate(userToDelete.id), style: "destructive" },
            ]
        );
    };

    const handleAddUser = () => {
       
        (navigation.navigate as any)('UserForm', { role: type }); 
    };


    if (user?.role !== 'professor') {
         return <Text style={styles.accessDeniedText}>Acesso Negado: Área de administração.</Text>;
    }

    if (isLoading) return <ActivityIndicator size="large" style={styles.loading} />;
    if (isError) return <Text style={styles.errorText}>Erro ao carregar lista de {type}s.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerenciar {type === 'professor' ? 'Professores' : 'Alunos'}</Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                <Text style={styles.addButtonText}>+ Adicionar Novo {type}</Text>
            </TouchableOpacity>

            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <UserItem 
                        item={item} 
                        handleDelete={handleDeleteConfirm} 
                    />
                )}
                style={styles.list}
            />
        </View>
    );
}

// ... (Estilos)
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#062E4B' },
    loading: { marginTop: 50 },
    errorText: { color: 'red', textAlign: 'center', padding: 20 },
    accessDeniedText: { color: '#D32F2F', textAlign: 'center', padding: 50, fontSize: 18 },
    list: { marginTop: 10 },
    // Estilos do Item
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    addButton: {
        backgroundColor: '#0E6DB1',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});