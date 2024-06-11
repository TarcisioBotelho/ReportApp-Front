import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Report } from '../types';

type MyReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyReports'>;

const MyReportsScreen = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const navigation = useNavigation<MyReportsScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      const fetchReports = async () => {
        try {
          const token = await AsyncStorage.getItem('token');

          if (!token) {
            Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
            return;
          }

          const response = await axios.get('http://192.168.1.110:3000/reports', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data: Report[] = response.data;
          setReports(data);
        } catch (error) {
          console.error('Erro ao buscar os reportes:', error);
          Alert.alert('Erro', 'Não foi possível carregar os reportes.');
        }
      };

      fetchReports();
    }, [])
  );

  const handleViewDetails = (report: Report) => {
    navigation.navigate('ReportDetails', { report });
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text style={styles.reportCategory}>{item.category}</Text>
      <Text numberOfLines={2} style={styles.reportDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewDetails(item)}>
        <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhum reporte encontrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  reportDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default MyReportsScreen;