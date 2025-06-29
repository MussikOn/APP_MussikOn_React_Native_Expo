import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import { RootStackParamList } from './utils/DatasTypes';
import Login from './components/pages/Login';
import Register from './components/pages/Register/Register';
import MainTabs from './components/MainTabs';
import AnimatedBackground from './components/styles/AnimatedBackground';
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <>
        <AnimatedBackground/>

    <NavigationContainer>
    <Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: 'rgba(1, 11, 153, 0)',
      elevation: 0, // Android
      shadowOpacity: 0, // iOS
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTransparent: true, 
  }}
>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"",headerLeft:()=>""}} />
        <Stack.Screen name="Register" component={Register} options={{title:"",headerLeft:()=>""}}/>
        <Stack.Screen name="Login" component={Login} options={{title:"",headerLeft:()=>""}}/>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

export default App;
