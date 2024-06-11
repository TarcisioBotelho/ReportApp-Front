import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const NewReportScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setImage(null);
    setUserLocation(null);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.1.110:3000/type-list');
      setCategories(response.data.type);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de Localização Negada', 'É necessário permitir o acesso à localização para usar essa funcionalidade.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });

    // Convert coordinates to address
    getAddressFromCoords(location.coords.latitude, location.coords.longitude);
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyATs2QzCPFC2S0p-JHwoNL3z4AKcuEyrdw`);
      let data = await response.json();
      
      if (data.results && data.results.length > 0) {
        let address = data.results[0].formatted_address;
        setLocation(address);
      } else {
        console.error('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGetLocation = () => {
    getUserLocation();
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        return;
      }

      const reportData = {
        title,
        type: category,
        description,
        image,
        location,
      };

      console.log('Enviando reporte com os seguintes dados:', reportData);

      const response = await axios.post('http://192.168.1.110:3000/add-report', reportData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Resposta do servidor:', response);

      if (response.status === 201) {
        Alert.alert('Reporte Enviado', 'Seu reporte foi enviado com sucesso.');
        resetForm(); // Resetar o formulário após envio com sucesso
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao enviar o reporte.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar o reporte.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={Platform.select({ android: 200 })}
    >
      <View style={styles.formContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Novo Reporte</Text>
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
                <Picker.Item label="Selecione uma categoria" value="" />
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
              <Text>Imagem</Text>
              <View style={{marginTop: 10, marginBottom: 10}}>
                {!image && (
                  <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <Text style={styles.imageButtonText}>TIRAR FOTO</Text>
                  </TouchableOpacity>
                )}
                {image &&
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                      <Text style={styles.removeImageButtonText}>REMOVER FOTO</Text>
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 10 }}>Imagem carregada com sucesso!</Text>
                  </View>
                }
              </View>
              <Text>Localização</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. Rua A, 10"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
                <Text style={styles.locationButtonText}>OBTER LOCALIZAÇÃO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>ENVIAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    marginTop: 10,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flex: 1,
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  removeImageButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default NewReportScreen;