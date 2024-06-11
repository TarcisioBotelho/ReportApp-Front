import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import NewReportScreen from './screens/NewReportScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import LogoutScreen from './screens/LogoutScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ReportDetailsScreen from './screens/ReportDetailsScreen';
import EditReportScreen from './screens/EditReportScreen';
import ProfileScreen from './screens/ProfileScreen';

import { RootStackParamList } from './types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Inicio':
              iconName = 'home-outline';
              break;
            case 'Novo Reporte':
              iconName = 'add-circle-outline';
              break;
            case 'Meus Reportes':
              iconName = 'list-outline';
              break;
            case 'Sair':
              iconName = 'log-out-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#007bff',
          borderTopColor: '#007bff',
          borderTopWidth: 0,
          paddingTop: 5,
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Novo Reporte" component={NewReportScreen} />
      <Tab.Screen name="Meus Reportes" component={MyReportsScreen} />
      <Tab.Screen name="Sair" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
            <Stack.Screen name="EditReport" component={EditReportScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;