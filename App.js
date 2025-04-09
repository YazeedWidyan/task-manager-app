import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/theme/theme';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
