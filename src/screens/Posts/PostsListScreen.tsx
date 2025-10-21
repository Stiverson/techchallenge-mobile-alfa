import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiFetchPosts } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import { type Comunicacao } from '../../types/comunicacao';

interface PostItemProps {
  item: Comunicacao; // 💡 Tipagem correta
  isProfessor: boolean; // 💡 Tipagem correta
  navigation: NavigationProp<any>; // 💡 Tipagem correta
}

const PostItem = ({ item, isProfessor, navigation }: PostItemProps) => {

  const handlePress = () => {
    navigation.navigate('PostDetails', { id: item.id });
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.author}>Por: {item.autor}</Text>
        <Text style={styles.date}>Criado em: {new Date(item.dataCriacao).toLocaleDateString()}</Text>
      </View>
      {isProfessor && ( 
        <View style={styles.actions}>
          <Ionicons name="create-outline" size={24} color="#0E6DB1" style={styles.icon} />
          <Ionicons name="trash-outline" size={24} color="red" style={styles.icon} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export function PostsListScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isProfessor = user?.role === 'professor';

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: apiFetchPosts,
  });

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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem item={item} isProfessor={isProfessor} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 15, paddingTop: 15 },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textGroup: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0E6DB1' },
  author: { fontSize: 14, color: '#555', marginTop: 5 },
  date: { fontSize: 12, color: '#999', marginTop: 3 },
  actions: { flexDirection: 'row', gap: 10, marginLeft: 15 },
  icon: { padding: 5 },
  errorText: { color: 'red', fontSize: 16 }
});