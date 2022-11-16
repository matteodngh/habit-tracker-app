import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = React.useState();

  const getData = async () => {
    var user_id = await AsyncStorage.getItem('user_id');
    fetch(`http://192.168.1.51:8000/api/users/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => setUser(res))
  }

  React.useEffect(() => {
    getData();
  }, []);

  const logout = () => {
    Alert.alert("Logout", "Are you sure?", [
      {
        text: "yes",
        onPress: async () => {
          await AsyncStorage.removeItem('HT_token');
          await AsyncStorage.removeItem('user_id');
          navigation.navigate('SignIn');
        }
      },
      {
        text: "no",
      }
    ]);
  }
  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.logout} onPress={() => logout()}>
        <Text style={styles.text}>Logout</Text>
        <Ionicons
          name='log-out-outline'
          size={20}
        />
      </TouchableOpacity>
      <View
        style={styles.separator}
      />
      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('ListHabits')}>
        <Text style={styles.text}>My Habits</Text>
        <Ionicons
          name='settings-outline'
          size={20}
        />
      </TouchableOpacity>
      <View
        style={styles.separator}
      />
      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.text}>Change Password</Text>
        <Ionicons
          name='key-outline'
          size={20}
        />
      </TouchableOpacity>
      <View
        style={styles.separator}
      />
      {user && <Text style={{ fontSize: 14, alignSelf: 'flex-start', marginTop: 10 }}>User {user.username} is logged.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
    margin: 5
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    paddingRight: 10
  },
  separator: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1.5,
    marginVertical: 10
  }
});
export default SettingsScreen;
