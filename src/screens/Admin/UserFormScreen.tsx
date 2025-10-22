import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { apiCreateUser, apiUpdateUser } from '../../api/users';
import { useAuth } from '../../context/AuthContext';


export function UserFormScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    
    const { token, user } = useAuth();
    
    // @ts-ignore
    const { role: routeRole, user: routeUser } = route.params as RouteParams;
    
    const isEditing = !!routeUser;
    const role = routeUser?.role || routeRole || 'aluno'; 


    const [email, setEmail] = useState(routeUser?.email || '');
    const [password, setPassword] = useState('');
    
    const isProfessor = user?.role === 'professor';

    const createUserMutation = useMutation({
        mutationFn: (data: any) => apiCreateUser(role, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', role] });
            Alert.alert("Sucesso", `${role} criado com sucesso!`);
            navigation.goBack();
        },
        onError: (error) => {
            Alert.alert("Erro", `Falha ao salvar usuário: ${error.message}`);
        }
    });


    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => apiUpdateUser(role, id, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', role] });
            Alert.alert("Sucesso", `${role} editado com sucesso!`);
            navigation.goBack();
        },
        onError: (error) => {
            Alert.alert("Erro", `Falha ao salvar alterações: ${error.message}`);
        }
    });

    const isPending = createUserMutation.isPending || updateMutation.isPending;

  
    const handleSubmit = () => {
        if (!email) {
            Alert.alert("Erro", "O e-mail é obrigatório.");
            return;
        }

        
        if (!isEditing && !password) {
            Alert.alert("Erro", "A senha é obrigatória para novos cadastros.");
            return;
        }

        
        let formData: any = { email }; 
        if (password) {
            formData.password = password; 
        }

        formData.role = role;

        if (isEditing && routeUser) {
            updateMutation.mutate({ id: routeUser.id, data: formData });
        } else {
            createUserMutation.mutate(formData);
        }
    };

 
    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? `Editar ${role.toUpperCase()}` : `Novo ${role.toUpperCase()}`,
            headerStyle: { backgroundColor: '#062E4B' },
            headerTintColor: '#fff',
        });
    }, [isEditing, role, navigation]);


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                editable={!isPending}
            />

            <Text style={styles.label}>Senha {isEditing ? "(Opcional)" : "(Obrigatória)"}</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
                placeholder={isEditing ? "Deixe vazio para manter a senha" : "Definir senha"}
                editable={!isPending}
            />
            
            <Text style={styles.roleInfo}>
                Você está {isEditing ? 'editando' : 'cadastrando'} o papel: {role.toUpperCase()}
            </Text>

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit} 
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar'}</Text>
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
        marginBottom: 15,
    },
    roleInfo: {
        fontSize: 14,
        color: '#0E6DB1',
        marginTop: 10,
        textAlign: 'center',
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