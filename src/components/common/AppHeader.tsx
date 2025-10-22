import { Feather } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

type AppNavigation = NavigationProp<any, any>;

const Logo = require('../../assets/images/logo.png'); 

export function AppHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); 
  };

    const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'GA';
    const displayName = user?.email || 'Usuário';
    const isProfessor = user?.role === 'professor';

    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.logoText}>Centro Educacional Alfa</Text>
            </View>

            <View style={styles.userContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.username}>{displayName}</Text>

                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Feather name="log-out" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#062E4B', 
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: 60, 
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30, 
        height: 30,
        resizeMode: 'contain',
    },
    logoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0E6DB1', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    username: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
        marginRight: 15,
    },
    logoutButton: {
        padding: 5,
    }
});