import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiLogin } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const Logo = require('../../assets/images/logo.png');

// 💡 Componente de Checkbox (simples)
interface CheckBoxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

const CheckBox = ({ checked, onChange, label }: CheckBoxProps) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onChange(!checked)}>
        <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
            {checked && <Feather name="check" size={14} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);


export default function LoginScreen() {
    // Mantemos as credenciais de teste
    const [email, setEmail] = useState('professor@alfa.com'); 
    const [password, setPassword] = useState('senha123'); 
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }
        setLoading(true);
        try {
            const data = await apiLogin({ email, password });
            await login(data.token);
            
        } catch (error) {
            Alert.alert("Erro", "Falha no login: Credenciais inválidas. Verifique o email/senha ou o backend.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.title}>Centro Educacional Alfa</Text>

                {/* 💡 Label "Username" (Figma) */}
                <Text style={styles.label}>Username</Text> 
                
                {/* Campo Email */}
                <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="#666" style={styles.icon} /> {/* 💡 ÍCONE CORRIGIDO */}
                    <TextInput
                        style={styles.input}
                        placeholder="professor@alfa.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                
                <Text style={styles.label}>Senha</Text> 
                
                {/* Campo Senha */}
                <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                {/* 💡 Checkbox e Link Esqueci Senha (Layout Figma) */}
                <View style={styles.optionsRow}>
                    <CheckBox checked={rememberMe} onChange={setRememberMe} label="Lembre de mim" />
                    <TouchableOpacity onPress={() => Alert.alert('Recuperação', 'Entre em contato com a administração.')}>
                        <Text style={styles.link}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Botão de Login */}
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#062E4B', justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: '#fff', borderRadius: 15, padding: 30, width: '90%', maxWidth: 400, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 8,
    },
    logo: { width: 100, height: 100, marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#0E6DB1', marginBottom: 30 },
    
    // 💡 Estilos para Labels (Username/Senha)
    label: { alignSelf: 'flex-start', marginLeft: 5, fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    
    // 💡 Estilo para a linha de opções (Lembre-me e Link)
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 5,
        marginBottom: 20, // Espaçamento antes do botão
    },

    inputContainer: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', 
        borderRadius: 8, marginBottom: 15, paddingHorizontal: 10, width: '100%', height: 50,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, height: '100%' },
    
    // 💡 Estilos do Checkbox
    checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
        width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#0E6DB1', 
        marginRight: 8, justifyContent: 'center', alignItems: 'center',
    },
    checkedCheckbox: {
        backgroundColor: '#0E6DB1', borderColor: '#0E6DB1',
    },
    checkboxLabel: { fontSize: 14, color: '#333' },

    button: {
        backgroundColor: '#0E6DB1', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', 
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { color: '#0E6DB1', fontSize: 14 },
});