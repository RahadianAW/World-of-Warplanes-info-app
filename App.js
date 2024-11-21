import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import WarplanesScreen from './screens/WarplanesScreen';
import WarplaneDetailScreen from './screens/WarplaneDetailScreen';
import PlayerScreen from './screens/PlayerScreen';
import PlayerDetailScreen from './screens/PlayerDetailScreen';
import ClanListScreen from './screens/ClanListScreen';
import ClanDetailScreen from './screens/ClanDetailScreen';
import AboutScreen from './screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WarplanesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="WarplanesList" component={WarplanesScreen} options={{ title: 'Warplanes' }} />
    <Stack.Screen name="WarplaneDetail" component={WarplaneDetailScreen} options={{ title: 'Warplane Details' }} />
  </Stack.Navigator>
);

const PlayerStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="PlayerList" component={PlayerScreen} options={{ title: 'Players' }} />
    <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Details' }} />
  </Stack.Navigator>
);

const ClanStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ClanList" component={ClanListScreen} options={{ title: 'Clans' }} />
    <Stack.Screen name="ClanDetail" component={ClanDetailScreen} options={{ title: 'Clan Details' }} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Warplanes':
                iconName = focused ? 'airplane' : 'airplane-outline';
                break;
              case 'Players':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'Clans':
                iconName = focused ? 'people' : 'people-outline';
                break;
              case 'About':
                iconName = focused ? 'information-circle' : 'information-circle-outline';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#002b80',
          tabBarInactiveTintColor: '#00369e',
          headerStyle: {
            backgroundColor: '#002b80',
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Warplanes" component={WarplanesStack} />
        <Tab.Screen name="Players" component={PlayerStack} />
        <Tab.Screen name="Clans" component={ClanStack} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}