import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';

type ReportDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReportDetails'>;
type ReportDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportDetails'>;

const ReportDetailsScreen = () => {
  const route = useRoute<ReportDetailsScreenRouteProp>();
  const navigation = useNavigation<ReportDetailsScreenNavigationProp>();
  const { report } = route.params;

  const handleDeleteReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        return;
      }

      const response = await axios.post(`http://192.168.1.110:3000/delete-report`, {
        report_id: report.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        Alert.alert('Sucesso', 'Reporte deletado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível deletar o reporte.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao deletar o reporte:', error);
        if (error.response && error.response.status === 404) {
          Alert.alert('Erro', 'Reporte não encontrado.');
        } else {
          Alert.alert('Erro', 'Não foi possível deletar o reporte.');
        }
      } else {
        console.error('Erro desconhecido ao deletar o reporte:', error);
        Alert.alert('Erro', 'Erro desconhecido ao deletar o reporte.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <Text style={styles.title}>{report.title}</Text>

      <Text style={styles.label}>Categoria</Text>
      <Text style={styles.category}>{report.category}</Text>

      <Text style={styles.label}>Descrição</Text>
      <Text style={styles.description}>{report.description}</Text>

      <Text style={styles.label}>Endereço</Text>
      <Text style={styles.address}>{report.location}</Text>

      {/* <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditReport', { report })}>
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteReport}>
        <Text style={styles.deleteButtonText}>Deletar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ReportDetailsScreen;