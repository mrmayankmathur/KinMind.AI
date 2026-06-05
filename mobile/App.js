import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ArmoryScreen from './src/screens/ArmoryScreen';
import colors from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      {/* presentation: 'modal' makes it slide up from the bottom like a mini-game overlay! */}
      <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 2,
            borderTopColor: colors.primary,
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === 'Voyage') icon = '🗺️';
            else if (route.name === 'Inventory') icon = '💰';
            else if (route.name === 'Armory') icon = '⚔️';
            return <Text style={{ fontSize: size }}>{icon}</Text>;
          },
        })}
      >
        <Tab.Screen name="Voyage" component={HomeStack} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="Armory" component={ArmoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
