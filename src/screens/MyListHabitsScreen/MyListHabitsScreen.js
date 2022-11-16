import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation, useIsFocused } from '@react-navigation/native';

const today = new Date().toISOString().split('T')[0];
const MyListHabitsScreen = () => {
  const [habits, setHabits] = useState([]);
  const [oldHabits, setOldHabits] = useState([]);
  const [showCurrents, setShowCurrents] = useState(true);
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const getData = async () => {
    var token = await AsyncStorage.getItem('HT_token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (token) {
      fetch(`http://192.168.1.51:8000/api/habits/?created_by=${user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`
        }
      })
        .then(res => res.json())
        .then(jsonRes => {
          var completed = [];
          var notcompleted = [];
          jsonRes.map((item) => {

            if (new Date(item.edate).getTime() < new Date(today).getTime()) {
              completed.push(item);
            } else {
              notcompleted.push(item);
            }
          })
          setHabits(notcompleted);
          setOldHabits(completed);
        })
        .catch(err => console.log(err))
    } else {
      navigation.navigate("SignIn");
    }
  };

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused, navigation])

  const habitClicked = (habit) => {
    navigation.navigate('EditHabit', { habit: habit });
  }
  const unsetshow = () => {
    setShowCurrents(false);
  }
  const setshow = () => {
    setShowCurrents(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={setshow}
          style={styles.headerbutton}
        >
          <Text style={[styles.itemText, { color: showCurrents ? 'black' : '#cccccc' }]}>HABITS IN PROGRESS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={unsetshow}
          style={styles.headerbutton}
        >
          <Text style={[styles.itemText, { color: showCurrents ? '#cccccc' : 'black' }]}>FINISHED HABITS</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={showCurrents ? habits : oldHabits}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => habitClicked(item)}
            style={styles.item}
          >
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginVertical: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 2
  },
  headerbutton: {
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    margin: 10,
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: 'gray',
  },
  itemText: {
    color: 'black',
    fontSize: 20
  },
});

export default MyListHabitsScreen;
