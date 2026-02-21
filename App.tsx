import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import EditHabitScreen from './src/screens/EditHabitScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Context providers
import {HabitProvider} from './src/context/HabitContext';
import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#0B162A'},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Habit Momentum'}}
      />
      <Stack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={{title: 'Add New Habit'}}
      />
      <Stack.Screen
        name="EditHabit"
        component={EditHabitScreen}
        options={{title: 'Edit Habit'}}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Habits') {
            iconName = 'list';
          } else if (route.name === 'Statistics') {
            iconName = 'analytics';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-today';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8EC5FC',
        tabBarInactiveTintColor: '#9EB3CF',
        tabBarStyle: {
          backgroundColor: '#0B162A',
          borderTopColor: '#1E3A5F',
        },
        headerStyle: {backgroundColor: '#0B162A'},
        headerTintColor: '#FFFFFF',
      })}>
      <Tab.Screen name="Dashboard" component={HomeStack} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HabitProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#0B162A" />
            <MainTabs />
          </NavigationContainer>
        </HabitProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
