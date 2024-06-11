import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const HomeScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
  });

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('http://192.168.1.110:3000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Erro', 'Não foi possível carregar o perfil do usuário.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>Seja bem vindo ao ReportApp,</Text>
        <Text style={styles.userName}>{userProfile.name}!</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    marginBottom: 10,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 18,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;