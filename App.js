import React from 'react';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo package
import { Provider } from 'react-redux'; // Import Provider from redux
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate from redux-persist
import * as Notifications from 'expo-notifications';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import InformationScreen from './src/screens/InformationScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import IntroductionScreen from './src/screens/IntroductionScreen';
import ResetPassword from './src/screens/ResetPassword';
import ForgotPassword from './src/screens/ForgotPassword';
import CodeScreen from './src/screens/CodeScreen';
import { store, persistor } from './src/redux/store'; // Import store and persistor
import ProfileScreen from './src/screens/ProfileScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import * as Device from 'expo-device';
import { usePushNotifications } from './src/utils/pushNotification';
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test" screenOptions={{ headerShown: false }} headerMode="none">
        {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}


        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Home" component={HomeTab} options={{ headerShown: false }} />

        <Stack.Screen name="InformationScreen" component={InformationTab} />

        <Stack.Screen name="Profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';

          } else if (route.name === 'InformationScreen') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }, tabBarLabel: () => null
      })}
      tabBarOptions={{
        activeTintColor: '#0891b2',
        inactiveTintColor: '#0891b2',
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="InformationScreen" component={InformationScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const InformationTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="InformationScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
         
          } else if (route.name === 'InformationScreen') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }, tabBarLabel: () => null
      })}
      tabBarOptions={{
        activeTintColor: '#0891b2',
        inactiveTintColor: '#0891b2',
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
     
      <Tab.Screen name="InformationScreen" component={InformationScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
};
const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Introduction" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Introduction" component={IntroductionScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="CodeScreen" component={CodeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* <Stack.Screen name="Sukien" component={Sukien}/> */}
    </Stack.Navigator>
  );
};
// const App = () => (
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <AppNavigator />
//     </PersistGate>
//   </Provider>
// );
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const App = () => {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  console.log('token', expoPushToken)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};
export default App;
// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

