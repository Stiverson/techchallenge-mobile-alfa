import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { apiCreatePost, apiUpdatePost } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import { type Comunicacao, type ComunicacaoForm } from '../../types/comunicacao';

interface RouteParams {
    post?: Comunicacao; 
}

export function PostFormScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    
    const { token, user } = useAuth();
    
    // @ts-ignore
    const { post } = (route.params || {}) as RouteParams;
    const isEditing = !!post;


    const [titulo, setTitulo] = useState(post?.titulo || '');
    const [descricao, setDescricao] = useState(post?.descricao || ''); 

    
    const [autor, setAutor] = useState(post?.autor || (user?.email || 'Professor Logado')); 

    const isProfessor = user?.role === 'professor';
    
    

    const createMutation = useMutation({
        mutationFn: (data: ComunicacaoForm) => apiCreatePost(data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigation.goBack();
        },
        onError: (error) => {
            alert(`Erro ao criar: ${error.message}`);
        }
    });

    
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ComunicacaoForm }) => apiUpdatePost(id, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigation.goBack();
        },
        onError: (error) => {
            alert(`Erro ao editar: ${error.message}`);
        }
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    
    const handleSubmit = () => {
        if (!isProfessor) {
            alert("Apenas professores podem criar/editar posts.");
            return;
        }
        if (!titulo || !descricao || !autor) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const formData: any = { 
            title: titulo,       
            content: descricao,  
            author: autor,       
            tipo: "Comunicado"   
        }; 

        if (isEditing && post) {
            updateMutation.mutate({ id: post.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    
    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Editar Comunicação' : 'Nova Comunicação',
            headerStyle: { backgroundColor: '#062E4B' },
            headerTintColor: '#fff',
        });
    }, [isEditing, navigation]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} editable={!isPending} />

            <Text style={styles.label}>Descrição/Conteúdo</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                editable={!isPending}
            />

            <Text style={styles.label}>Autor</Text>
            <TextInput style={styles.input} value={autor} onChangeText={setAutor} editable={false} /> 

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isPending}>
                {isPending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Criar Comunicação'}</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#0E6DB1',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});