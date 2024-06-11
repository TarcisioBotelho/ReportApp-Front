import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import axios from 'axios';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>(); // tipo de navegação aqui

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Email inválido.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('URL_DO_BACKEND/reset-password', { email });

      if (response.data.success) {
        Alert.alert('Redefinição de Senha', 'Um email de redefinição de senha foi enviado para ' + email);
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o email de redefinição de senha. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>R</Text>
              <Text style={styles.appName}>ReportApp</Text>
              <Text style={styles.subtitle}>digite seu email para redefinir a senha</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>VOLTAR</Text>
                </TouchableOpacity>
                {loading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : (
                  <TouchableOpacity style={styles.resetPasswordButton} onPress={handleResetPassword}>
                    <Text style={styles.resetPasswordButtonText}>ENVIAR EMAIL</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 100,
    color: 'white',
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    width: '95%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resetPasswordButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  resetPasswordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;