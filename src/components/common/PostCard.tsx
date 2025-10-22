import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Comunicacao } from '../../types/comunicacao';

interface PostCardProps {
    item: Comunicacao;
    isProfessor: boolean;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function PostCard({ item, isProfessor, onPress, onEdit, onDelete }: PostCardProps) {
  
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);

    
    const shortDescription = item.descricao.length > 100 
        ? item.descricao.substring(0, 100) + '...'
        : item.descricao;

    const handleMenuToggle = () => {
       
        if (isProfessor) {
            setIsMenuVisible(!isMenuVisible);
        }
    };

    const handleEditAction = () => {
        setIsMenuVisible(false);
        onEdit();
    };

    const handleDeleteAction = () => {
        setIsMenuVisible(false);
        onDelete();
    };

    return (
        <View style={styles.cardWrapper}>
           
            <View style={styles.topRow}>
                <TouchableOpacity onPress={onPress} style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{item.titulo}</Text>
                    <View style={styles.authorContainer}>
                        <Text style={styles.author}>{item.autor}</Text>
                        
                        <Feather name="chevron-up" size={16} color="#666" style={styles.chevronIcon} /> 
                    </View>
                </TouchableOpacity>

             
                {isProfessor ? (
                    <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.menuButtonPlaceholder} /> 
                )}
            </View>

            
            {isMenuVisible && isProfessor && (
                <View style={styles.adminMenu}>
                    <TouchableOpacity onPress={handleEditAction} style={styles.adminMenuItem}>
                        <Text style={styles.adminMenuText}>✏️ Editar dados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteAction} style={styles.adminMenuItem}>
                        <Text style={[styles.adminMenuText, { color: 'red' }]}>🗑️ Deletar</Text>
                    </TouchableOpacity>
                </View>
            )}

          
            <View style={styles.contentArea}>
                <Text style={styles.descriptionText} numberOfLines={2}>
                    {shortDescription}
                </Text>

              
                <View style={styles.metadataRow}>
                    <View style={styles.metadataItem}>
                        <Text style={styles.metadataLabel}>🗓️ Data criação</Text>
                        <Text style={styles.metadataValue}>{new Date(item.dataCriacao).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.metadataItem}>
                        <Text style={styles.metadataLabel}>🗓️ Data atualização</Text>
                        <Text style={styles.metadataValue}>{new Date(item.dataAtualizacao).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.metadataItem}>
                        <Text style={styles.metadataLabel}>Tipo</Text>
                        <Text style={styles.typeTag}>{item.tipo}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
    cardWrapper: {
        backgroundColor: '#fff',
        borderRadius: 16, 
        padding: 16, 
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'visible', 
    },

  
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
        marginBottom: 10,
    },
    titleContainer: {
        flex: 1, 
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    author: {
        fontSize: 14,
        color: '#666',
        marginRight: 5,
    },
    chevronIcon: {
        marginTop: 2,
    },

    
    menuButton: {
        padding: 5,
        marginLeft: 10,
    },
    menuButtonPlaceholder: {
        width: 34,
        height: 34, 
        marginLeft: 10,
    },
    adminMenu: {
        position: 'absolute',
        top: 40, 
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 100, 
        minWidth: 150,
        paddingVertical: 5,
    },
    adminMenuItem: {
        padding: 10,
    },
    adminMenuText: {
        fontSize: 14,
        color: '#333',
    },

    // 💡 ÁREA DE CONTEÚDO
    contentArea: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 5,
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },

    // 💡 METADADOS
    metadataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        flexWrap: 'wrap',
    },
    metadataItem: {
        minWidth: '45%',
        marginBottom: 8,
    },
    metadataLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    metadataValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    typeTag: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0E6DB1',
        backgroundColor: '#E6F4FE',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        overflow: 'hidden',
        textAlign: 'center',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    metadataRight: {
        alignItems: 'flex-end',
    }
});