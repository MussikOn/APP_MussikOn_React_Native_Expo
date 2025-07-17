import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator'; // Asumo que este es el componente principal de navegación

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
} 