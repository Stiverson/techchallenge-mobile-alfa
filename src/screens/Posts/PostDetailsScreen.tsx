import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiFetchPosts } from '../../api/posts';

export function PostDetailsScreen() {
  // Obtém os parâmetros (id) da rota
  const route = useRoute();
  // @ts-ignore
  const { id } = route.params;

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: apiFetchPosts,
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0E6DB1" style={styles.loading} />;
  }

  if (isError || !posts) {
    return <Text style={styles.errorText}>Erro ao carregar o post.</Text>;
  }

  const post = posts.find(p => p.id === id);

  if (!post) {
      return <Text style={styles.errorText}>Post não encontrado.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>
      <Text style={styles.author}>Por: {post.autor}</Text>
      <Text style={styles.date}>Criado em: {new Date(post.dataCriacao).toLocaleDateString()}</Text>
      <View style={styles.divider} />
      <Text style={styles.content}>{post.descricao}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#062E4B' },
  author: { fontSize: 16, color: '#555' },
  date: { fontSize: 14, color: '#999', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  content: { fontSize: 16, lineHeight: 24, color: '#333' },
  errorText: { color: 'red', fontSize: 16, padding: 20 }
});