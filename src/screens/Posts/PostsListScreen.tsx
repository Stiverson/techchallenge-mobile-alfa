import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiDeletePost, apiFetchPosts } from '../../api/posts';
import { PostCard } from '../../components/common/PostCard';
import { useAuth } from '../../context/AuthContext';
import { type Comunicacao } from '../../types/comunicacao';


type AppStackParamList = {
    PostDetails: { id: string };
    PostForm: { post?: Comunicacao };
    MainTabs: undefined; 
    [key: string]: object | undefined; 
};

export function PostsListScreen() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const queryClient = useQueryClient();
    const { user, token } = useAuth(); 
    const isProfessor = user?.role === 'professor';
    
    const [searchText, setSearchText] = useState(''); 

    const { data: posts, isLoading, isError, error } = useQuery({
      queryKey: ['posts'],
      queryFn: apiFetchPosts,
    });
    
    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiDeletePost(id, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            Alert.alert("Sucesso", "Post excluído com sucesso!");
        },
        onError: (e) => {
            Alert.alert("Erro", `Não foi possível excluir: ${e.message}`); 
        }
    });

    const handleDeleteConfirm = (post: Comunicacao) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Deseja realmente excluir o post "${post.titulo}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    onPress: () => deleteMutation.mutate(post.id),
                    style: "destructive"
                },
            ]
        );
    };
    
    const handleNavigateToCreate = () => {
        navigation.navigate('PostForm' as never); 
    };

    const filteredPosts = posts?.filter(post => 
        post.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
        post.autor.toLowerCase().includes(searchText.toLowerCase())
    ) || [];


    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E6DB1" />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Erro ao carregar posts: {error.message}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        
        <View style={styles.contentHeader}>
            <Text style={styles.accessLabel}>Acessos</Text>
            <Text style={styles.mainTitle}>Comunicações</Text>
        </View>

        <View style={styles.searchAndCreateContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder="Pesquisar..."
                value={searchText}
                onChangeText={setSearchText}
            />
            
            {isProfessor && (
                <TouchableOpacity style={styles.createButton} onPress={handleNavigateToCreate}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
        
        
            <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PostCard 
                    item={item} 
                    isProfessor={isProfessor} 
                    onPress={() => navigation.navigate('PostDetails', { id: item.id } as any)} 
                    onEdit={() => navigation.navigate('PostForm', { post: item } as any)}
                    onDelete={() => handleDeleteConfirm(item)}
                />
            )}
            contentContainerStyle={styles.listContent}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    // Estilos de Cabeçalho (Figma)
    contentHeader: { paddingHorizontal: 15, paddingTop: 15 },
    accessLabel: { fontSize: 12, color: '#0E6DB1', marginBottom: 5, fontWeight: '500' },
    mainTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    
    // Estilos da Barra de Busca e Botão
    searchAndCreateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginRight: 10,
        fontSize: 16
    },
    createButton: {
        backgroundColor: '#0E6DB1',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Estilo da lista (Espaçamento do Figma)
    listContent: { paddingHorizontal: 15, paddingBottom: 30 },
    errorText: { color: 'red', fontSize: 16, padding: 20 },
    // Estilos que foram movidos para o PostCard foram removidos daqui
});