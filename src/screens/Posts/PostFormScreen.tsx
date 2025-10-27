import { Feather, Ionicons } from '@expo/vector-icons';
// 💡 REMOVEMOS A IMPORTAÇÃO DO PICKER
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiCreatePost, apiUpdatePost } from '../../api/posts';
import { TypeSelectModal } from '../../components/common/TypeSelectModal'; // 👈 NOVO MODAL
import { useAuth } from '../../context/AuthContext';
import { type Comunicacao, type ComunicacaoForm } from '../../types/comunicacao';

interface RouteParams {
    post?: Comunicacao; 
}

const TIPOS_COMUNICACAO = [
    { label: "Comunicado", value: "Comunicado" },
    { label: "Aviso", value: "Aviso" },
    { label: "Outros", value: "Outros" }
];


export function PostFormScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    
    const { token, user } = useAuth();
    
    // @ts-ignore
    const { post } = (route.params || {}) as RouteParams;
    const isEditing = !!post;

    // 💡 Estado de visibilidade do modal de seleção
    const [isTypeModalVisible, setIsTypeModalVisible] = useState(false); 

    // Estados
    const [titulo, setTitulo] = useState(post?.titulo || '');
    const [descricao, setDescricao] = useState(post?.descricao || ''); 
    const [autor, setAutor] = useState(post?.autor || (user?.email || 'Professor Logado')); 
    const [tipo, setTipo] = useState(post?.tipo || 'Comunicado'); // <-- Valor Inicial Válido

    const isProfessor = user?.role === 'professor';
    
    // Mutações (Mantido)
    const createMutation = useMutation({
        mutationFn: (data: ComunicacaoForm) => apiCreatePost(data, token!),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); navigation.goBack(); },
        onError: (error) => { Alert.alert("Erro", `Erro ao criar: ${error.message}`); }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ComunicacaoForm }) => apiUpdatePost(id, data, token!),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); navigation.goBack(); },
        onError: (error) => { Alert.alert("Erro", `Erro ao editar: ${error.message}`); }
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    
    const handleSubmit = () => {
        if (!isProfessor) { Alert.alert("Erro", "Apenas professores podem criar/editar posts."); return; }
        
        // 💡 VALIDAÇÃO: Se o tipo for 'Comunicado' (o valor inicial), garante que não seja o valor 'Comunicado' de fallback.
        if (!titulo || !descricao || !autor || !tipo) { 
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        const formData: any = { 
            title: titulo, content: descricao, author: autor, tipo: tipo 
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
        <View style={styles.fullScreenContainer}>
            <ScrollView style={styles.scrollViewContent}>
                
                <Text style={styles.label}>Título*</Text>
                <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} editable={!isPending} placeholder="Digite o título" />

                <Text style={styles.label}>Descrição/Conteúdo</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={4}
                    editable={!isPending}
                    placeholder="Digite a descrição"
                />
                
                <Text style={styles.label}>Autor*</Text>
                <TextInput style={styles.input} value={autor} onChangeText={setAutor} editable={false} placeholder="Digite o autor" /> 

                {/* 💡 CAMPO TIPO: Agora é um Touchable que abre o Modal */}
                <Text style={styles.label}>Tipo*</Text>
                <TouchableOpacity style={styles.dropdownContainer} onPress={() => setIsTypeModalVisible(true)} disabled={isPending}>
                    <Text style={styles.dropdownText}>{tipo}</Text>
                    <Feather name="chevron-down" size={20} color="#666" style={{ marginRight: 5 }} />
                </TouchableOpacity>
                
                {/* 💡 RENDERIZAÇÃO DO MODAL DE SELEÇÃO */}
                <TypeSelectModal
                    isVisible={isTypeModalVisible}
                    options={TIPOS_COMUNICACAO}
                    selectedValue={tipo}
                    onSelect={setTipo} // 💡 O estado 'tipo' será atualizado
                    onClose={() => setIsTypeModalVisible(false)}
                />
                
            </ScrollView>

            {/* 💡 RENDERIZAÇÃO DO MODAL DE SELEÇÃO */}
            <TypeSelectModal
                isVisible={isTypeModalVisible}
                options={TIPOS_COMUNICACAO}
                selectedValue={tipo}
                onSelect={setTipo} // 💡 O estado 'tipo' será atualizado
                onClose={() => setIsTypeModalVisible(false)}
            />

            {/* 💡 FOOTER COM BOTÕES (Layout Figma) */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.footerButtonClose} 
                    onPress={() => navigation.goBack()}
                    disabled={isPending}
                >
                    <Feather name="x" size={20} color="#333" />
                    <Text style={styles.footerButtonTextClose}>Fechar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.footerButtonSubmit} 
                    onPress={handleSubmit} 
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.footerButtonTextSubmit}>{isEditing ? 'Salvar' : 'Adicionar'}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: { flex: 1, backgroundColor: '#f0f0f0' },
    scrollViewContent: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 15, },
    textArea: { height: 100, textAlignVertical: 'top' },
    
    // 💡 Estilos do Dropdown (Substituindo o Picker)
    dropdownContainer: {
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        height: 50, paddingHorizontal: 10, marginBottom: 15,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    dropdownText: { fontSize: 16, color: '#333' },
    
    // 💡 Estilos do Footer (Fixo e com Botões)
    footer: {
        flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: '#fff', borderTopWidth: 1,
        borderTopColor: '#eee', padding: 15, gap: 10,
    },
    footerButtonClose: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10,
        borderRadius: 8, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1,
    },
    footerButtonTextClose: { marginLeft: 5, color: '#333', fontWeight: 'bold' },
    footerButtonSubmit: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10,
        borderRadius: 8, backgroundColor: '#0E6DB1',
    },
    footerButtonTextSubmit: { marginLeft: 5, color: '#fff', fontWeight: 'bold' },
});