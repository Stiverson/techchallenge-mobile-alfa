import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AdminHomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página Principal da Administração (Em desenvolvimento)</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
    text: { fontSize: 18, fontWeight: 'bold' }
});