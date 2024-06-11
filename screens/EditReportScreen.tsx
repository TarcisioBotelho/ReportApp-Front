import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList, Report } from '../types';

type EditReportScreenRouteProp = RouteProp<RootStackParamList, 'EditReport'>;
type EditReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditReport'>;

const EditReportScreen = () => {
  const route = useRoute<EditReportScreenRouteProp>();
  const navigation = useNavigation<EditReportScreenNavigationProp>();
  const { report } = route.params;

  const [title, setTitle] = useState(report.title);
  const [description, setDescription] = useState(report.description);
  const [category, setCategory] = useState(report.type ? report.type.id.toString() : '');
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.1.110:3000/type-list');
        setCategories(response.data.type);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        Alert.alert('Erro', 'Não foi possível carregar as categorias.');
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        return;
      }

      const response = await axios.post('http://192.168.1.110:3000/update-report', {
        report_id: report.id,
        title,
        type: category,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Reporte atualizado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao atualizar o reporte.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o reporte:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o reporte.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Reporte</Text>
      <Text>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <Text>Categoria</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map(cat => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
        ))}
      </Picker>
      <Text>Descrição</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditReportScreen;