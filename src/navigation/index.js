import { View, Text, Settings } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../screens/HomeScreen'
import MyListHabitsScreen from '../screens/MyListHabitsScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import AddHabitHomeScreen from '../screens/AddHabitHomeScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import EditDetailScreen from '../screens/EditHabitScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';

const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const ListStack = createNativeStackNavigator();
const StatsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const InitialStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center'
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
  );
}

function StatsStackScreen() {
  return (
    <StatsStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center'
      }}>
      <StatsStack.Screen name="StatsScreen" component={StatsScreen} options={{ title: 'Statistics' }} />
      <StatsStack.Screen name='HabitDetail' component={HabitDetailScreen} options={{ title: 'Detail' }} />
    </StatsStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center'
      }}
    >
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
      <SettingsStack.Screen name='ListHabits' component={MyListHabitsScreen} options={{ title: 'My Habits' }} />
      <SettingsStack.Screen name='ChangePassword' component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
      <SettingsStack.Screen
        name='EditHabit'
        component={EditDetailScreen}
        options={{
          title: 'Edit Habit',
        }}
      />
    </SettingsStack.Navigator>
  );
}

function AddHabitStackScreen() {
  return (
    <ListStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <ListStack.Screen name='AddHabitHome' component={AddHabitHomeScreen} options={{ title: 'Create a new Habit' }} />
      <ListStack.Screen name='AddHabit' component={AddHabitScreen} options={{ title: 'Add a new Habit' }} />
    </ListStack.Navigator>
  );
}


function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name='ConfirmEmail' component={ConfirmEmailScreen} />
      <AuthStack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
      <AuthStack.Screen name='NewPassword' component={NewPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function InitialTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName; if (route.name === 'Home') {
            iconName = focused
              ? 'calendar-outline'
              : 'calendar-outline';
          } else if (route.name === 'MyHabits') {
            iconName = focused
              ? 'list-outline'
              : 'list';
          } else if (route.name === 'Stats') {
            iconName = focused
              ? 'stats-chart-outline'
              : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused
              ? 'settings-outline'
              : 'settings-outline';
          } else if (route.name === 'AddHabitStack') {
            iconName = focused
              ? 'add-circle-outline'
              : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarinactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name='Home' component={HomeStackScreen} />
      <Tab.Screen name='AddHabitStack' component={AddHabitStackScreen} options={{ title: "New Habit" }} />
      <Tab.Screen name='Stats' component={StatsStackScreen} />
      <Tab.Screen name='Settings' component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <InitialStack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <InitialStack.Screen name='AuthStack' component={AuthStackScreen} />
        <InitialStack.Screen
          name='InitialTab'
          component={InitialTabScreen}
        />
      </InitialStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
