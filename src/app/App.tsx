import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions} from '@react-navigation/stack';
import HomeScreen from '../screens/dashboard/HomeScreen';
import { RootStackParamList } from '../types/DatasTypes';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import { MainTabs } from '../components/navigation';
import AnimatedBackground from '../components/ui/styles/AnimatedBackground';
// import RequestMusicianScreen from '../components/features/pages/musicianRequest/RequestMusicianScreen';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions:StackNavigationOptions = {
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
  }
const App = () => {
  return (
    <>
        <AnimatedBackground/>

    <NavigationContainer>
    <Stack.Navigator
  screenOptions={screenOptions}
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
