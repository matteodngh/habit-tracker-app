import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from "react-native-calendars";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { summary } from 'date-streaks';
var today = new Date().toISOString().split('T')[0]

const HabitDetailScreen = ({ navigation, route }) => {
  const [dailychecks, setDailychecks] = useState([]);
  const dates = [];
  const habit = route.params.habit;

  function changeDateFormat(inputDate) {  // expects Y-m-d
    var splitDate = inputDate.split('-');
    if (splitDate.count == 0) {
      return null;
    }

    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];

    return month + '\/' + day + '\/' + year;
  }

  const getData = async () => {
    var token = await AsyncStorage.getItem('HT_token');
    if (token) {
      fetch(`http://192.168.1.51:8000/api/dailychecks/?habit=${habit.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          setDailychecks(res);
        })
        .catch(err => console.log(err))
    } else {
      navigation.navigate("Auth");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let markedDays = {};

  dailychecks.map((item) => {
    if (new Date(item.date).getTime() < new Date(today).getTime()) {
      if (item.done) {
        markedDays[item.date] = {
          selected: true,
          selectedColor: '#8cc68c',
        };
        var newDate = changeDateFormat(item.date);
        console.log(newDate);
        dates.push(new Date(newDate));
      } else {
        markedDays[item.date] = {
          selected: true,
          selectedColor: "#ff6666",
        };
      }
    } else {
      if (item.done) {
        markedDays[item.date] = {
          selected: true,
          selectedColor: "green",
        };
        var newDate = changeDateFormat(item.date);
        console.log(newDate);
        dates.push(new Date(newDate));
      } else {
        markedDays[item.date] = {
          selected: true,
          selectedColor: "red",
        };
      }
    }
  });

  const deleteYes = async (habit_id) => {
    var token = await AsyncStorage.getItem('HT_token');
    if (token) {
      fetch(`http://192.168.1.51:8000/api/habits/${habit_id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      })
        .then(navigation.goBack())
        .catch(err => console.log(err))
    } else {
      navigation.navigate("SignIn");
    }
  }

  const deleteHabit = (habit_id) => {
    Alert.alert("Delete", "Are you sure?", [
      {
        text: "yes",
        onPress: () => deleteYes(habit_id)
      },
      {
        text: "no",
      }
    ]);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{habit.title.toUpperCase()}</Text>
      <Text style={styles.description}>{habit.description}</Text>
      <View style={styles.calendar}>
        <Calendar
          markingType={'custom'}
          markedDates={markedDays}
          current={new Date(habit.edate).getMonth() < new Date(today).getMonth() || new Date(habit.sdate).getMonth() > new Date(today).getMonth() ? habit.sdate : today}
        />
      </View>
      <View style={styles.streaks}>
        <Text>CURRENT STREAK: {summary(dates).currentStreak}</Text>
        <Text>LONGEST STREAK: {summary(dates).longestStreak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    marginVertical: 5
  },
  icons: {
    flexDirection: 'row',
  },
  trash: {
    marginHorizontal: 10
  },
  description: {
    fontSize: 18,
    marginVertical: 3
  },
  textDates: {
    fontSize: 16
  },
  calendar: {
    marginTop: 20
  },
  streaks: {
    flexDirection: 'row',
    alignContent: 'space-between'
  }
});

export default HabitDetailScreen;
