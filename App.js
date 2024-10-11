import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

import Profile from './screens/Profile';
import ListaDeProdutos from './screens/ListaDeProdutos';


const stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
    <stack.Navigator initialRouteName="Login">
        
        <stack.Screen name="Profile" component={Profile}></stack.Screen>
        <stack.Screen name="ListaDeProdutos" component={ListaDeProdutos}></stack.Screen>
    </stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
